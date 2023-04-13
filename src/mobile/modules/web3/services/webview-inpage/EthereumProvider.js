import { ethErrors, serializeError } from 'eth-rpc-errors'
import { intToHex } from 'ethereumjs-util'
import { providers } from 'ethers'
import { EventEmitter } from 'events'
import { forIn } from 'lodash'

import DedupePromise from './dedupePromise'
import PushEventHandlers from './pushEventsHandlers'
import ReadyPromise from './readyPromise'

const ETH_RPC_METHODS_AMBIRE_MUST_HANDLE = [
  'eth_getTransactionByHash',
  'eth_getEncryptionPublicKey',
  'eth_accounts',
  'eth_coinbase',
  'eth_requestAccounts',
  'eth_sendTransaction',
  'eth_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4'
]

// const domReadyCall = (callback) => {
//   if (document.readyState === 'complete') {
//     callback()
//   } else {
//     const domContentLoadedHandler = () => {
//       callback()
//       document.removeEventListener('DOMContentLoaded', domContentLoadedHandler)
//     }
//     document.addEventListener('DOMContentLoaded', domContentLoadedHandler)
//   }
// }

class EthereumProvider extends EventEmitter {
  chainId = null

  selectedAddress = null

  networkVersion = null

  dAppOwnProviders = {}

  isAmbire = true

  isMetaMask = true

  // TODO: Temporarily set to true to avoid breaking the app
  _isReady = true

  _isConnected = false

  _initialized = false

  _isUnlocked = false

  _cacheRequestsBeforeReady = []

  _cacheEventListenersBeforeReady = []

  _state = {
    accounts: null,
    isConnected: false,
    isUnlocked: false,
    initialized: false,
    isPermanentlyDisconnected: false
  }

  _metamask = {
    isUnlocked: () => {
      return new Promise((resolve) => {
        resolve(this._isUnlocked)
      })
    }
  }

  _pushEventHandlers

  _requestPromise = new ReadyPromise(2)

  _dedupePromise = new DedupePromise([
    'personal_sign',
    'wallet_addEthereumChain',
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4'
  ])

  constructor({ DAPP_PROVIDER_URLS, networks }) {
    super()
    this.DAPP_PROVIDER_URLS = DAPP_PROVIDER_URLS
    this.networks = networks
    this.initialize()
    this.shimLegacy()
    this._pushEventHandlers = new PushEventHandlers(this)
  }

  initialize = async () => {
    if (window?.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          method: 'tabCheckin',
          params: { origin }
        }),
        '*'
      )
      this._requestPromise.check(2)
    }

    // domReadyCall(() => {
    //   const origin = location.origin

    // })

    try {
      const { chainId, accounts, networkVersion, isUnlocked } = await this.request({
        method: 'getProviderState'
      })
      if (isUnlocked) {
        this._isUnlocked = true
        this._state.isUnlocked = true
      }
      this.chainId = chainId
      this.networkVersion = networkVersion
      this._pushEventHandlers.chainChanged({
        chain: chainId,
        networkVersion
      })

      this._pushEventHandlers.accountsChanged(accounts)

      // eslint-disable-next-line no-restricted-globals
      const { hostname } = location
      if (DAPP_PROVIDER_URLS[hostname]) {
        // eslint-disable-next-line no-restricted-syntax
        forIn(DAPP_PROVIDER_URLS[hostname], async (providerUrl, networkId) => {
          const network = networks.find((n) => n.id === networkId)
          if (!network || !providerUrl) return

          try {
            this.dAppOwnProviders[network.id] = providerUrl.startsWith('wss:')
              ? new providers.WebSocketProvider(providerUrl, {
                  name: network.name,
                  chainId: network.chainId
                })
              : new providers.JsonRpcProvider(providerUrl, {
                  name: network.name,
                  chainId: network.chainId
                })

            // Acts as a mechanism to check if the provider credentials work
            // eslint-disable-next-line no-await-in-loop
            await this.dAppOwnProviders[network.id]?.getNetwork()
          } catch (e) {
            this.dAppOwnProviders[network.id] = null
          }
        })
      }
    } catch {
      //
    } finally {
      this._initialized = true
      this._state.initialized = true
      this.emit('_initialized')
    }
  }

  isConnected = () => {
    return true
  }

  // TODO: support multi request!
  request = async (data) => {
    if (!this._isReady) {
      const promise = new Promise((resolve, reject) => {
        this._cacheRequestsBeforeReady.push({
          data,
          resolve,
          reject
        })
      })
      return promise
    }
    return this._dedupePromise.call(data.method, () => this._request(data))
  }

  _request = async (data) => {
    if (!data) {
      throw ethErrors.rpc.invalidRequest()
    }

    // TODO: Temporarily return dummy:
    switch (data.method) {
      case 'eth_accounts':
        return ['0xdd2a7Dc3d038b5EA4164D41B3617aDa5eb4179bf']
      case 'eth_chainId':
        return '0x1'
      case 'net_version':
        return '1'
      case 'eth_requestAccounts':
        return ['0xdd2a7Dc3d038b5EA4164D41B3617aDa5eb4179bf']
      case 'personal_sign':
        return '0xYourSignedMessage'
      case 'eth_sendTransaction':
        return '0xYourTransactionHash'
      // Add more methods as needed
      default:
    }

    // TODO: Try with:
    // window.ReactNativeWebView.postMessage(JSON.stringify(message))

    return this._requestPromise.call(() => {
      if (
        data.method.startsWith('eth_') &&
        !ETH_RPC_METHODS_AMBIRE_MUST_HANDLE.includes(data.method)
      ) {
        const network = networks.find((n) => intToHex(n.chainId) === this.chainId)
        if (network?.id && this.dAppOwnProviders[network.id]) {
          return this.dAppOwnProviders[network.id]
            ?.send(data.method, data.params)
            .then((res) => {
              return res
            })
            .catch((err) => {
              throw err
            })
        }
      }

      return window?.ReactNativeWebView
        ? window?.ReactNativeWebView?.postMessage(JSON.stringify(data), '*')
        : null
      // .then((res) => {
      //   return res
      // })
      // .catch((err) => {
      //   throw serializeError(err)
      // })
    })
  }

  requestInternalMethods = (data) => {
    return this._dedupePromise.call(data.method, () => this._request(data))
  }

  // shim to matamask legacy api
  sendAsync = (payload, callback) => {
    if (Array.isArray(payload)) {
      return Promise.all(
        payload.map(
          (item) =>
            new Promise((resolve) => {
              this.sendAsync(item, (err, res) => {
                // ignore error
                resolve(res)
              })
            })
        )
      ).then((result) => callback(null, result))
    }
    if (typeof payload === 'object') {
      const { method, params, ...rest } = payload
      this.request({ method, params })
        .then((result) => callback(null, { ...rest, method, result }))
        .catch((error) => callback(error, { ...rest, method, error }))
    } else {
      callback(null)
    }
  }

  send = (payload, callback?) => {
    if (typeof payload === 'string' && (!callback || Array.isArray(callback))) {
      // send(method, params? = [])
      return this.request({
        method: payload,
        params: callback
      }).then((result) => ({
        id: undefined,
        jsonrpc: '2.0',
        result
      }))
    }

    if (typeof payload === 'object' && typeof callback === 'function') {
      return this.sendAsync(payload, callback)
    }

    let result
    switch (payload.method) {
      case 'eth_accounts':
        result = this.selectedAddress ? [this.selectedAddress] : []
        break

      case 'eth_coinbase':
        result = this.selectedAddress || null
        break

      default:
        throw new Error("sync method doesn't support")
    }

    return {
      id: payload.id,
      jsonrpc: payload.jsonrpc,
      result
    }
  }

  shimLegacy = () => {
    const legacyMethods = [
      ['enable', 'eth_requestAccounts'],
      ['net_version', 'net_version']
    ]

    for (const [_method, method] of legacyMethods) {
      this[_method] = () => this.request({ method })
    }
  }

  on = (event, handler) => {
    if (!this._isReady) {
      this._cacheEventListenersBeforeReady.push([event, handler])
      return this
    }
    return super.on(event, handler)
  }
}

export default EthereumProvider
