/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
const intToHex = function (i) {
  if (!Number.isSafeInteger(i) || i < 0) {
    throw new Error(`Received an invalid integer type: ${i}`)
  }
  return `0x${i.toString(16)}`
}

class DedupePromise {
  _blackList

  _tasks = {}

  constructor(blackList) {
    this._blackList = blackList
  }

  async call(key, defer) {
    if (this._blackList.includes(key) && this._tasks[key]) {
      // throw ethErrors.rpc.transactionRejected
      throw {
        code: -32003,
        message: 'There is a pending request, please request after it resolved'
      }
    }

    return new Promise((resolve) => {
      this._tasks[key] = (this._tasks[key] || 0) + 1

      resolve(
        defer().finally(() => {
          this._tasks[key]--
          if (!this._tasks[key]) {
            delete this._tasks[key]
          }
        })
      )
    })
  }
}

class PushEventHandlers {
  provider

  constructor(provider) {
    this.provider = provider
  }

  _emit(event, data) {
    if (this.provider._initialized && this.provider._isReady) {
      this.provider.emit(event, data)
    }
  }

  connect = (data) => {
    if (!this.provider._isConnected) {
      this.provider._isConnected = true
      this.provider._state.isConnected = true
      this._emit('connect', data)
    }
  }

  unlock = () => {
    this.provider._isUnlocked = true
    this.provider._state.isUnlocked = true
  }

  lock = () => {
    this.provider._isUnlocked = false
  }

  disconnect = () => {
    this.provider._isConnected = false
    this.provider._state.isConnected = false
    this.provider._state.accounts = null
    this.provider.selectedAddress = null
    // disconnectError = ethErrors.provider.disconnected
    const disconnectError = {
      code: 4900,
      message: 'The provider is disconnected from all chains.'
    }
    this._emit('accountsChanged', [])
    this._emit('disconnect', disconnectError)
    this._emit('close', disconnectError)

    const id = Date.now() + Math.random()
    data.id = id
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        method: 'disconnect'
      })
    )
  }

  accountsChanged = (accounts) => {
    if (accounts?.[0] === this.provider.selectedAddress) {
      return
    }

    this.provider.selectedAddress = accounts?.[0]
    this.provider._state.accounts = accounts
    this._emit('accountsChanged', accounts)
  }

  chainChanged = ({ chain, networkVersion }) => {
    this.connect({ chainId: chain })

    if (chain !== this.provider.chainId) {
      this.provider.chainId = chain
      this._emit('chainChanged', chain)
    }

    if (networkVersion !== this.provider.networkVersion) {
      this.provider.networkVersion = networkVersion
      this._emit('networkChanged', networkVersion)
    }
  }

  'ambire:chainChanged' = (network) => {
    if (network && intToHex(network?.chainId) !== this.provider.chainId?.toLowerCase()) {
      this._emit('ambire:chainChanged', network)
    }
  }
}

class ReadyPromise {
  _allCheck = []

  _tasks = []

  constructor(count) {
    this._allCheck = [...Array(count)]
  }

  check = (index) => {
    this._allCheck[index - 1] = true
    this._proceed()
  }

  uncheck = (index) => {
    this._allCheck[index - 1] = false
  }

  _proceed = () => {
    if (this._allCheck.some((_) => !_)) {
      return
    }

    while (this._tasks.length) {
      const { resolve, fn } = this._tasks.shift()
      resolve(fn())
    }
  }

  call = (fn) => {
    return new Promise((resolve) => {
      this._tasks.push({
        fn,
        resolve
      })

      this._proceed()
    })
  }
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleBackgroundMessage({ event, data }) {
  if (window.ethereum._pushEventHandlers[event]) {
    return window.ethereum._pushEventHandlers[event](data)
  }

  window.ethereum.emit(event, data)
}

class EthereumProvider extends EventEmitter {
  chainId = null

  selectedAddress = null

  networkVersion = null

  isAmbire = true

  isMetaMask = false

  _isReady = false

  _isConnected = true

  _initialized = false

  _isUnlocked = true

  promises = {}

  _cacheRequestsBeforeReady = []

  _cacheEventListenersBeforeReady = []

  _state = {
    accounts: null,
    isConnected: true,
    isUnlocked: true,
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

  _requestPromise = new ReadyPromise(1)

  _dedupePromise = new DedupePromise([
    'personal_sign',
    'wallet_addEthereumChain',
    'eth_signTypedData',
    'eth_signTypedData_v1',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4'
  ])

  constructor() {
    super()
    this.initialize()
    this.shimLegacy()
    this._pushEventHandlers = new PushEventHandlers(this)
  }

  initialize = async () => {
    domReadyCall(async () => {
      const origin = location?.origin
      const icon =
        $('head > link[rel~="icon"]')?.href || $('head > meta[itemprop="image"]')?.content
      const name = document.title || $('head > meta[name="title"]')?.content || origin

      await (function () {
        const id = Date.now() + Math.random()
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            method: 'tabCheckin',
            id,
            params: { icon, name, origin }
          })
        )
        return new Promise((resolve) => {
          window.ethereum.promises[id] = { resolve }
        })
      })()

      this._requestPromise.check(1)
    })
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
      // throw ethErrors.rpc.invalidRequest
      throw {
        code: -32600,
        message: 'The JSON sent is not a valid Request object.'
      }
    }
    return this._requestPromise.call(() => {
      const id = Date.now() + Math.random()
      data.id = id

      if (
        data.method.startsWith('eth_') &&
        !ETH_RPC_METHODS_AMBIRE_MUST_HANDLE.includes(data.method)
      ) {
        data.handleRequestByDappProvider = true
        data.origin = location?.origin
        data.hostname = location?.hostname
        data.chainId = this.chainId
      }

      window.ReactNativeWebView.postMessage(JSON.stringify(data))
      const promise = new Promise((resolve, reject) => {
        // Save the resolve and reject functions with the ID
        window.ethereum.promises[id] = { resolve, reject }
      })

      return promise
        .then((res) => {
          return res
        })
        .catch((err) => {
          throw err
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

  send = (payload, callback) => {
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

const provider = new EthereumProvider()
const cacheOtherProvider = null
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
  isDefaultWallet = true

  let finalProvider = null
  if (isDefaultWallet || !cacheOtherProvider) {
    finalProvider = ambireProvider
    Object.keys(finalProvider).forEach((key) => {
      window.ethereum[key] = finalProvider[key]
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
      window.ethereum[key] = finalProvider[key]
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
    finalProvider.on(event, handler)
  })
  provider._cacheRequestsBeforeReady.forEach(({ resolve, reject, data }) => {
    finalProvider.request(data).then(resolve).catch(reject)
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
