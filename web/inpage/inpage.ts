// Script that is injected into dapp's context through content-script. it mounts ethereum to window

import networks from 'ambire-common/src/constants/networks'
import { ethErrors, serializeError } from 'eth-rpc-errors'
import { providers } from 'ethers'
import { EventEmitter } from 'events'

import DedupePromise from '@web/inpage/services/dedupePromise'
import PushEventHandlers from '@web/inpage/services/pushEventsHandlers'
import ReadyPromise from '@web/inpage/services/readyPromise'
import BroadcastChannelMessage from '@web/message/broadcastChannelMessage'
import logger, { logInfoWithPrefix } from '@web/utils/logger'

declare const channelName: any

export interface Interceptor {
  onRequest?: (data: any) => any
  onResponse?: (res: any, data: any) => any
}

interface StateProvider {
  accounts: string[] | null
  isConnected: boolean
  isUnlocked: boolean
  initialized: boolean
  isPermanentlyDisconnected: boolean
}

const domReadyCall = (callback) => {
  if (document.readyState === 'complete') {
    callback()
  } else {
    const domContentLoadedHandler = () => {
      callback()
      document.removeEventListener('DOMContentLoaded', domContentLoadedHandler)
    }
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler)
  }
}

const $ = document.querySelector.bind(document)

export class EthereumProvider extends EventEmitter {
  chainId: string | null = null

  selectedAddress: string | null = null

  /**
   * The network ID of the currently connected Ethereum chain.
   * @deprecated
   */
  networkVersion: string | null = null

  dAppOwnProvider: providers.JsonRpcProvider | null = null

  isAmbire = true

  isMetaMask = true

  _isReady = false

  _isConnected = false

  _initialized = false

  _isUnlocked = false

  _cacheRequestsBeforeReady: any[] = []

  _cacheEventListenersBeforeReady: [string | symbol, () => any][] = []

  _state: StateProvider = {
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

  private _pushEventHandlers: PushEventHandlers

  private _requestPromise = new ReadyPromise(2)

  private _dedupePromise = new DedupePromise([
    'personal_sign',
    'wallet_addEthereumChain',
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4'
  ])

  private _bcm = new BroadcastChannelMessage(channelName)

  constructor({ maxListeners = 100 } = {}) {
    super()
    this.setMaxListeners(maxListeners)
    this.initialize()
    this.shimLegacy()
    this._pushEventHandlers = new PushEventHandlers(this)
  }

  initialize = async () => {
    document.addEventListener('visibilitychange', this._requestPromiseCheckVisibility)

    this._bcm.connect().on('message', this._handleBackgroundMessage)
    domReadyCall(() => {
      const origin = location.origin
      const icon =
        ($('head > link[rel~="icon"]') as HTMLLinkElement)?.href ||
        ($('head > meta[itemprop="image"]') as HTMLMetaElement)?.content

      const name =
        document.title || ($('head > meta[name="title"]') as HTMLMetaElement)?.content || origin

      this._bcm.request({
        method: 'tabCheckin',
        params: { icon, name, origin }
      })

      this._requestPromise.check(2)
    })

    try {
      const { chainId, accounts, networkVersion, isUnlocked }: any = await this.request({
        method: 'getProviderState'
      })
      if (isUnlocked) {
        this._isUnlocked = true
        this._state.isUnlocked = true
      }
      this.chainId = chainId
      this.networkVersion = networkVersion
      this.emit('connect', { chainId })
      this._pushEventHandlers.chainChanged({
        chain: chainId,
        networkVersion
      })

      this._pushEventHandlers.accountsChanged(accounts)

      try {
        if (chainId) {
          const { chainId, name } =
            networks.find((n) => n.chainId === parseInt(chainId)) || networks[0]

          console.log('dApp own provider initiated')

          this.dAppOwnProvider = new providers.JsonRpcProvider(
            'https://mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1',
            {
              name,
              chainId
            }
          )

          // TODO: Check if it works.
        }
      } catch (e) {
        // fail silently
        console.log('dApp own provider failed to init', e)
      }
    } catch {
      //
    } finally {
      this._initialized = true
      this._state.initialized = true
      this.emit('_initialized')
    }
  }

  private _requestPromiseCheckVisibility = () => {
    if (document.visibilityState === 'visible') {
      this._requestPromise.check(1)
    } else {
      this._requestPromise.uncheck(1)
    }
  }

  private _handleBackgroundMessage = ({ event, data }) => {
    if (this._pushEventHandlers[event]) {
      return this._pushEventHandlers[event](data)
    }

    this.emit(event, data)
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

    this._requestPromiseCheckVisibility()

    return this._requestPromise.call(() => {
      if (['eth_blockNumber', 'eth_call'].includes(data.method)) {
        if (this.dAppOwnProvider) {
          // TODO: For testing only.
          // const ethBlockN = this.dAppOwnProvider.send(data.method, data.params)
          // ethBlockN.then((e) => console.log('response dapp provider', e))

          return this.dAppOwnProvider.send(data.method, data.params)
        }
      }

      if (data.method !== 'eth_call') {
        logInfoWithPrefix('[request]', JSON.stringify(data, null, 2))
      }

      return this._bcm
        .request(data)
        .then((res) => {
          if (data.method !== 'eth_call') {
            logInfoWithPrefix('[request: success]', data.method, res)
          }
          return res
        })
        .catch((err) => {
          if (data.method !== 'eth_call') {
            logInfoWithPrefix('[request: error]', data.method, serializeError(err))
          }
          throw serializeError(err)
        })
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

  on = (event: string | symbol, handler: (...args: any[]) => void) => {
    if (!this._isReady) {
      this._cacheEventListenersBeforeReady.push([event, handler])
      return this
    }
    return super.on(event, handler)
  }
}

declare global {
  interface Window {
    ethereum: EthereumProvider
    web3: any
  }
}

const provider = new EthereumProvider()
let cacheOtherProvider: EthereumProvider | null = null
const ambireProvider = new Proxy(provider, {
  deleteProperty: (target, prop) => {
    if (prop === 'on' || prop === 'isAmbire') {
      // @ts-ignore
      delete target[prop]
    }
    return true
  }
})

provider.requestInternalMethods({ method: 'isDefaultWallet' }).then((isDefaultWallet) => {
  // TODO: Take (ans switch this setting from the Ambire settings)
  isDefaultWallet = true
  // ambireProvider.on('defaultWalletChanged', switchWalletNotice)

  let finalProvider: EthereumProvider | null = null
  if (isDefaultWallet || !cacheOtherProvider) {
    finalProvider = ambireProvider
    Object.keys(finalProvider).forEach((key) => {
      window.ethereum[key] = (finalProvider as EthereumProvider)[key]
    })
    Object.defineProperty(window, 'ethereum', {
      set() {
        provider.requestInternalMethods({
          method: 'hasOtherProvider',
          params: []
        })
        return finalProvider
      },
      get() {
        return finalProvider
      }
    })
    window.web3 = {
      currentProvider: ambireProvider
    }
    finalProvider._isReady = true
    // finalProvider.on('ambire:chainChanged', switchChainNotice)
  } else {
    finalProvider = cacheOtherProvider
    // @ts-ignore
    delete ambireProvider.on
    // @ts-ignore
    delete ambireProvider.isAmbire
    Object.keys(finalProvider).forEach((key) => {
      window.ethereum[key] = (finalProvider as EthereumProvider)[key]
    })
    const keys = ['selectedAddress', 'chainId', 'networkVersion']
    keys.forEach((key) => {
      Object.defineProperty(cacheOtherProvider, key, {
        get() {
          return window.ethereum[key]
        },
        set(val) {
          window.ethereum[key] = val
        }
      })
    })
  }
  provider._cacheEventListenersBeforeReady.forEach(([event, handler]) => {
    ;(finalProvider as EthereumProvider).on(event, handler)
  })
  provider._cacheRequestsBeforeReady.forEach(({ resolve, reject, data }) => {
    ;(finalProvider as EthereumProvider).request(data).then(resolve).catch(reject)
  })
})

if (window.ethereum) {
  cacheOtherProvider = window.ethereum
  provider.requestInternalMethods({
    method: 'hasOtherProvider',
    params: []
  })
}

window.ethereum = ambireProvider

Object.defineProperty(window, 'ethereum', {
  set(val) {
    provider.requestInternalMethods({
      method: 'hasOtherProvider',
      params: []
    })
    cacheOtherProvider = val
  },
  get() {
    return ambireProvider
  }
})

window.web3 = {
  currentProvider: window.ethereum
}

window.dispatchEvent(new Event('ethereum#initialized'))
