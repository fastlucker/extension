/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
import { ethErrors, serializeError } from 'eth-rpc-errors'
import { JsonRpcProvider, toBeHex, WebSocketProvider } from 'ethers'
import { EventEmitter } from 'events'
import { forIn, isUndefined } from 'lodash'
import { nanoid } from 'nanoid'

import networks, { NetworkId } from '@common/constants/networks'
import { delayPromise } from '@common/utils/promises'
import { ETH_RPC_METHODS_AMBIRE_MUST_HANDLE } from '@web/constants/common'
import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'
import {
  findShadowRootElementById,
  getAllShadowRoots,
  getVisibleWordsOccurrencesInPage,
  quickWordsCountInPage,
  replaceIconOnlyConnectionButtons,
  replaceMetamaskInW3Modal,
  replaceOtherWalletWithAmbireInConnectionModals
} from '@web/extension-services/inpage/page-content-replacement'
import DedupePromise from '@web/extension-services/inpage/services/dedupePromise'
import PushEventHandlers from '@web/extension-services/inpage/services/pushEventsHandlers'
import ReadyPromise from '@web/extension-services/inpage/services/readyPromise'
import BroadcastChannelMessage from '@web/extension-services/message/broadcastChannelMessage'
import { logInfoWithPrefix, logWarnWithPrefix } from '@web/utils/logger'

declare let ambireChannelName: string
declare let defaultWallet: DefaultWallet
const ambireId = nanoid()
const ambireIsOpera = /Opera|OPR\//i.test(navigator.userAgent)
let doesWebpageReadOurProvider: boolean = false
let isEIP6963: boolean = false
let _defaultWallet: DefaultWallet = 'AMBIRE'
let focusedListener: any = null
let mmOccurrencesOnFirstDOMLoad: number | null = null
let shadowRoots: ShadowRoot[] | null = null
export type DefaultWallet = 'AMBIRE' | 'OTHER'

let observer: MutationObserver | null = null
let observerOptions: MutationObserverInit = { childList: true }
let clickListener: any
let initializeReplacementTimeout: any

//
// MetaMask text and icon replacement (for dApps using legacy connect only) (not replacing when EIP6963)
//

const runReplacementScript = (shouldUpdateShadowRoots: boolean = true) => {
  if (_defaultWallet === 'OTHER') return

  if (initializeReplacementTimeout) {
    clearTimeout(initializeReplacementTimeout)
  }

  if (shouldUpdateShadowRoots || shadowRoots === null) {
    shadowRoots = getAllShadowRoots()
  }

  if (quickWordsCountInPage('metamask', shadowRoots) === 0) {
    if (mmOccurrencesOnFirstDOMLoad === null) {
      mmOccurrencesOnFirstDOMLoad = 0
    }
    return
  }

  const wordsOccurrencesResult = getVisibleWordsOccurrencesInPage(
    [
      ['metamask'],
      ['okx wallet'],
      ['walletconnect', 'wallet connect'],
      ['coinbasewallet', 'coinbase wallet', 'coinbase'],
      ['trustwallet', 'trust wallet']
    ],
    undefined,
    shadowRoots
  )

  const mmOccurrences = wordsOccurrencesResult.filter((res) => res.words.includes('metamask'))[0]
  const okxOccurrences = wordsOccurrencesResult.filter((res) => res.words.includes('okx wallet'))[0]

  if (mmOccurrencesOnFirstDOMLoad === null) {
    mmOccurrencesOnFirstDOMLoad = mmOccurrences.count
  }

  const hasMetaMaskInPage = mmOccurrences.count !== 0
  const hasOKXWalletInPage = okxOccurrences.count !== 0

  if (!doesWebpageReadOurProvider && !hasMetaMaskInPage && !hasOKXWalletInPage) return

  const wcOccurrences = wordsOccurrencesResult.filter((res) =>
    res.words.includes('walletconnect')
  )[0]
  const coinbaseOccurrences = wordsOccurrencesResult.filter((res) =>
    res.words.includes('coinbase')
  )[0]

  const hasWalletConnectInPage = wcOccurrences.count !== 0
  const hasCoinbaseWalletInPage = coinbaseOccurrences.count !== 0

  // most dapps read the provider but some don't till connection
  if (!doesWebpageReadOurProvider && !(hasWalletConnectInPage && hasCoinbaseWalletInPage)) {
    return
  }

  ;(async () => {
    if (!isEIP6963) {
      await delayPromise(30)
    }
    if (isEIP6963) return

    const w3Modal = findShadowRootElementById('w3m-modal')
    if (w3Modal) replaceMetamaskInW3Modal(w3Modal)

    if (hasWalletConnectInPage) replaceIconOnlyConnectionButtons('metamask')

    const trustWalletOccurrences = wordsOccurrencesResult.filter((res) =>
      res.words.includes('trustwallet')
    )[0]
    const hasTrustWalletInPage = trustWalletOccurrences.count !== 0

    if (!hasMetaMaskInPage && !hasOKXWalletInPage) return

    if (!(hasWalletConnectInPage || hasCoinbaseWalletInPage || hasTrustWalletInPage)) {
      return
    }

    if (hasMetaMaskInPage) {
      if (mmOccurrencesOnFirstDOMLoad !== 0 && mmOccurrencesOnFirstDOMLoad === mmOccurrences.count)
        return
      mmOccurrences.nodes.forEach((n) => {
        replaceOtherWalletWithAmbireInConnectionModals(
          ['metamask', 'connect by metamask'],
          'metamask',
          n.parentNode as any
        )
      })
      return
    }

    const hasAmbireInPage = getVisibleWordsOccurrencesInPage([['ambire']])[0].count !== 0

    if (!hasMetaMaskInPage && !hasAmbireInPage && hasOKXWalletInPage) {
      okxOccurrences.nodes.forEach((n) => {
        replaceOtherWalletWithAmbireInConnectionModals(
          ['okx wallet', 'connect by okx wallet'],
          'okx wallet',
          n.parentNode as any
        )
      })
    }
  })()
}

function runReplacementScriptWithShadowRoots() {
  runReplacementScript(true)
}

function runReplacementScriptWithoutShadowRoots() {
  runReplacementScript(false)
}

function cleanupObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

function setupObserver(options?: MutationObserverInit) {
  cleanupObserver()
  observer = new MutationObserver(runReplacementScriptWithShadowRoots)
  observer.observe(document, options)
}

Object.defineProperty(window, 'defaultWallet', {
  configurable: false,
  get() {
    return _defaultWallet
  },
  set(value: DefaultWallet) {
    _defaultWallet = value
    if (value === 'AMBIRE') {
      initializeReplacementTimeout = setTimeout(() => {
        if (mmOccurrencesOnFirstDOMLoad === null) {
          runReplacementScriptWithShadowRoots()
        }
      }, 250)
      if (!clickListener) {
        clickListener = document.addEventListener('click', runReplacementScriptWithoutShadowRoots)
      }
      if (!observer) {
        setupObserver(observerOptions)
      }
    }
  }
})

function cleanup() {
  cleanupObserver()
  if (clickListener) {
    document.removeEventListener('click', runReplacementScriptWithoutShadowRoots)
  }
}

window.addEventListener('beforeunload', cleanup)
window.addEventListener('unload', cleanup)

//
// EthereumProvider Injection
//

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

interface EIP6963ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}
interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: EthereumProvider
}

interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: 'eip6963:announceProvider'
  detail: EIP6963ProviderDetail
}

interface EIP6963RequestProviderEvent extends Event {
  type: 'eip6963:requestProvider'
}

// keep isMetaMask and remove isAmbire
const impersonateMetamaskWhitelist = [
  // layerzero
  'bitcoinbridge.network',
  'bridge.liquidswap.com',
  'theaptosbridge.com',
  'app.actafi.org',

  // rainbow
  'goal3.xyz',
  'enso.finance',
  'telx.network',
  'link3.to',
  'hypercerts.org',
  'quickswap.exchange'
]

// keep isAmbire and remove isMetaMask
const ambireHostList: string[] = []

const isIncludesHost = (current: string, target: string) => {
  return current === target || current.endsWith(`.${target}`)
}

const isInHostList = (list: string[], host: string) => {
  return list.some((target) => isIncludesHost(host, target))
}

export const getProviderMode = (host: string) => {
  if (isInHostList(impersonateMetamaskWhitelist, host)) {
    return 'metamask'
  }
  if (isInHostList(ambireHostList, host)) {
    return 'ambire'
  }
  return 'default'
}

export const patchProvider = (p: any) => {
  const mode = getProviderMode(window.location.hostname)
  try {
    if (mode === 'metamask') {
      delete p.isAmbire
      p.isMetaMask = true
      return
    }
    if (mode === 'ambire') {
      delete p.isMetaMask
      p.isAmbire = true
      return
    }
    if (mode === 'default') {
      p.isMetaMask = true
      p.isAmbire = true
      return
    }
  } catch (e) {
    console.error(e)
  }
}

const domReadyCall = (callback: any) => {
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

  dAppOwnProviders: {
    [key in NetworkId]?: JsonRpcProvider | WebSocketProvider | null
  } = {}

  isAmbire = true

  isMetaMask = true

  _isAmbire = true

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

  private _dedupePromise = new DedupePromise([])

  private _bcm = new BroadcastChannelMessage(ambireChannelName || 'ambire-inpage')

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
      const { chainId, accounts, networkVersion, isUnlocked }: any =
        await this.requestInternalMethods({
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

      // eslint-disable-next-line no-restricted-globals
      const { hostname } = location
      if (DAPP_PROVIDER_URLS[hostname]) {
        // eslint-disable-next-line no-restricted-syntax
        forIn(DAPP_PROVIDER_URLS[hostname], async (providerUrl, networkId) => {
          const network = networks.find((n) => n.id === networkId)
          if (!network || !providerUrl) return

          try {
            this.dAppOwnProviders[network.id] = providerUrl.startsWith('wss:')
              ? new WebSocketProvider(providerUrl, {
                  name: network.name,
                  chainId: network.chainId
                })
              : new JsonRpcProvider(providerUrl, {
                  name: network.name,
                  chainId: network.chainId
                })

            // Acts as a mechanism to check if the provider credentials work
            // eslint-disable-next-line no-await-in-loop
            await Promise.race([
              this.dAppOwnProviders[network.id]?.getNetwork(),
              // Timeouts after 3 secs because sometimes the provider call hangs with no response
              delayPromise(3000)
            ])
            logInfoWithPrefix(`👌 The dApp's own provider initiated for ${network.name} network.`)
          } catch (e) {
            this.dAppOwnProviders[network.id] = null
            logWarnWithPrefix(
              `The dApp's own provider for ${network.name} network failed to init.`,
              e
            )
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

  private _requestPromiseCheckVisibility = () => {
    if (document.visibilityState === 'visible') {
      this._requestPromise.check(1)
    } else {
      this._requestPromise.uncheck(1)
    }
  }

  private _handleBackgroundMessage = ({ event, data }: any) => {
    if (data?.type === 'setDefaultWallet') {
      defaultWallet = data?.value
      if (data.shouldReload) {
        const reload = () => {
          if (focusedListener) {
            window.removeEventListener('focus', reload)
            focusedListener = null
          }
          if (isEIP6963) return
          window.location.reload()
        }

        if (document.hasFocus()) {
          reload()
        } else {
          focusedListener = window.addEventListener('focus', reload)
        }
      }
      return
    }

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

    return this._requestPromise.call(async () => {
      if (
        data.method.startsWith('eth_') &&
        !ETH_RPC_METHODS_AMBIRE_MUST_HANDLE.includes(data.method)
      ) {
        const network = networks.find((n) => toBeHex(n.chainId) === this.chainId)
        if (network?.id && this.dAppOwnProviders[network.id]) {
          if (data.method !== 'eth_call') {
            logInfoWithPrefix('[⏩ forwarded request]', data)
          }

          try {
            const result = await Promise.race([
              this.dAppOwnProviders[network.id]?.send(data.method, data.params),
              // Timeouts after 3 secs because sometimes the provider call hangs with no response
              delayPromise(3000)
            ])

            if (data.method !== 'eth_call') {
              logInfoWithPrefix('[⏩ forwarded request: success]', data.method, result)
            }

            // Otherwise, if no result comes, do not return, fallback to our provider.
            if (!isUndefined(result)) return result
          } catch (err) {
            //  Do not throw on error because there is fallback to our provider.
            if (data.method !== 'eth_call') {
              logWarnWithPrefix('[⏩ forwarded request: error]', data.method, err)
            }
          }
        }
      }

      if (data.method !== 'eth_call') {
        logInfoWithPrefix('[request]', data)
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
    const { method, params, ...rest } = payload
    this.request({ method, params })
      .then((result) => callback(null, { ...rest, method, result }))
      .catch((error) => callback(error, { ...rest, method, error }))
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
    ambire: EthereumProvider
  }
}

const provider = new EthereumProvider()
patchProvider(provider)
let cacheOtherProvider: EthereumProvider | null = null
const ambireProvider = new Proxy(provider, {
  deleteProperty: (target, prop) => {
    if (typeof prop === 'string' && ['on', 'isAmbire', 'isMetaMask', '_isAmbire'].includes(prop)) {
      // @ts-ignore
      delete target[prop]
    }
    return true
  }
})

const requestHasOtherProvider = () => {
  return provider.requestInternalMethods({
    method: 'hasOtherProvider',
    params: []
  })
}

const setAmbireProvider = () => {
  try {
    Object.defineProperty(window, 'ethereum', {
      configurable: false,
      enumerable: true,
      set(val) {
        if (val?._isAmbire) {
          return
        }
        requestHasOtherProvider()
        cacheOtherProvider = val
        return ambireProvider
      },
      get() {
        // script to determine whether the page is a dapp or not
        // (only pages that are dapps should read the ethereum provider)
        // the provider is called from multiple instances (current page and other extensions)
        // we need only the calls from the current page
        if (!doesWebpageReadOurProvider) {
          try {
            throw new Error()
          } catch (error: any) {
            const stack = error.stack // Parse the stack trace to get the caller info
            if (stack) {
              const callerPage = stack.split('\n')[2].trim()
              if (callerPage.includes(window.location.hostname)) {
                doesWebpageReadOurProvider = true
                clickListener = document.addEventListener(
                  'click',
                  runReplacementScriptWithoutShadowRoots
                )
                observerOptions = { childList: true, subtree: true, attributes: true }
                setupObserver(observerOptions)
              }
            }
          }
        }

        return defaultWallet === 'AMBIRE' ? ambireProvider : cacheOtherProvider || ambireProvider
      }
    })
  } catch (e) {
    // think that defineProperty failed means there is any other wallet
    requestHasOtherProvider()
    console.error(e)
    window.ethereum = ambireProvider
  }
}

// this config prevents other wallets to override our provider
// MM for example with the default provider setup overrides our window.ethereum on Opera browser
const initOperaProvider = () => {
  Object.defineProperty(window, 'ethereum', {
    value: ambireProvider,
    configurable: false, // Make it non-configurable
    writable: false, // Make it non-writable
    enumerable: true
  })
  ambireProvider._isReady = true
  window.ambire = ambireProvider
  patchProvider(ambireProvider)
}

const initProvider = () => {
  ambireProvider._isReady = true
  let finalProvider: EthereumProvider | null = null

  if (window.ethereum && !window.ethereum._isAmbire) {
    requestHasOtherProvider()
    cacheOtherProvider = window.ethereum
  }

  finalProvider = ambireProvider
  patchProvider(ambireProvider)
  setAmbireProvider()

  if (!window.web3) {
    window.web3 = {
      currentProvider: finalProvider
    }
  }
  window.ambire = ambireProvider
}

if (ambireIsOpera) {
  initOperaProvider()
} else {
  initProvider()
}

const announceEip6963Provider = (p: EthereumProvider) => {
  const info: EIP6963ProviderInfo = {
    uuid: ambireId,
    name: 'Ambire',
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='40' height='40' viewBox='0 0 40 40'%3E%3Cdefs%3E%3ClinearGradient id='linear-gradient' x1='0.554' y1='0.58' x2='0.052' y2='0.409' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236000ff'/%3E%3Cstop offset='0.651' stop-color='%234900c3'/%3E%3Cstop offset='1' stop-color='%23320086'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-2' x1='0.06' y1='-0.087' x2='0.486' y2='0.653' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236a0aff'/%3E%3Cstop offset='0.047' stop-color='%238c2dff'/%3E%3Cstop offset='0.102' stop-color='%236a0aff'/%3E%3Cstop offset='0.902' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%23af50ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-3' x1='1.071' y1='0.062' x2='0.095' y2='1.049' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236a0aff'/%3E%3Cstop offset='0.51' stop-color='%238c2dff'/%3E%3Cstop offset='0.969' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%23af50ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-4' x1='0.448' y1='0.297' x2='0.538' y2='0.8' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236000ff'/%3E%3Cstop offset='1' stop-color='%233e00a5'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-5' x1='-0.529' y1='1.069' x2='1.092' y2='0.86' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23ae60ff'/%3E%3Cstop offset='0.322' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%236000ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-6' x1='-0.111' y1='0.274' x2='0.872' y2='1.224' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%236f0fff'/%3E%3Cstop offset='0.702' stop-color='%23af50ff'/%3E%3Cstop offset='1' stop-color='%23af50ff'/%3E%3C/linearGradient%3E%3ClinearGradient id='linear-gradient-7' x1='0.015' y1='0.007' x2='0.985' y2='0.95' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23ae60ff'/%3E%3Cstop offset='0.031' stop-color='%23b670fa'/%3E%3Cstop offset='1' stop-color='%23be80f5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg id='ambire_symbol_40x40' data-name='ambire symbol 40x40' transform='translate(20193 20411)'%3E%3Cg id='Ambire_Wallet' data-name='Ambire Wallet' transform='translate(-20184.996 -20408.99)'%3E%3Cg id='_1967776972864' transform='translate(0.013 -0.01)'%3E%3Cg id='Group_190' data-name='Group 190'%3E%3Cpath id='Path_636' data-name='Path 636' d='M526.324,626.595l4.724,10.056a.284.284,0,0,1-.058.314l-12.427,12.007a.138.138,0,0,1-.233-.1V637.836l7.831-7.56a.254.254,0,0,0,.081-.2l.023-3.484c0-.023.047-.023.058,0Z' transform='translate(-507.107 -613.01)' fill='%236000ff'/%3E%3Cpath id='Path_637' data-name='Path 637' d='M518.34,803.227v11.032a.138.138,0,0,0,.233.1h0L531,802.356a.284.284,0,0,0,.058-.313h0l-4.852-6.413Z' transform='translate(-507.116 -778.401)' fill-rule='evenodd' fill='url(%23linear-gradient)'/%3E%3Cpath id='Path_638' data-name='Path 638' d='M881.705,626.01h0a.027.027,0,0,0-.028.028h0l-.02,3.483a.286.286,0,0,1-.046.162l4.871,6.574a.3.3,0,0,0-.023-.174h0l-4.724-10.056a.032.032,0,0,0-.028-.016h0Z' transform='translate(-862.52 -612.454)' fill-rule='evenodd' fill='url(%23linear-gradient-2)'/%3E%3Cpath id='Path_639' data-name='Path 639' d='M895.766,814.726a.3.3,0,0,0-.023-.174h0l-.245-.522-4.4-5.6,4.665,6.3Z' transform='translate(-871.805 -790.924)' fill='%23be80f5' fill-rule='evenodd'/%3E%3Cpath id='Path_640' data-name='Path 640' d='M41.775,235.523l-2.222,6.294a.292.292,0,0,0,.012.221l2.071,4.076-5.7,3.228a.149.149,0,0,1-.2-.058L34.5,246.718a.247.247,0,0,1,.023-.267l7.191-10.962a.035.035,0,0,1,.058.035Z' transform='translate(-33.728 -230.38)' fill='%236000ff'/%3E%3Cpath id='Path_641' data-name='Path 641' d='M57.616,235.46h0a.031.031,0,0,0-.022.009h0l-6.884,10.493-.008.014,4.727-4.179.015-.042h0v0L57.65,235.5a.034.034,0,0,0-.034-.044Z' transform='translate(-49.602 -230.361)' fill-rule='evenodd' fill='url(%23linear-gradient-3)'/%3E%3Cpath id='Path_642' data-name='Path 642' d='M34.516,532.813a.247.247,0,0,0-.023.267h0l1.233,2.566a.149.149,0,0,0,.2.058h0l5.7-3.228L39.554,528.4a.29.29,0,0,1-.012-.221Z' transform='translate(-33.718 -516.743)' fill-rule='evenodd' fill='url(%23linear-gradient-4)'/%3E%3Cpath id='Path_643' data-name='Path 643' d='M11.237.047V9.836a.279.279,0,0,1-.058.163h0L.067,25.06a.269.269,0,0,0,.035.36h0l7.8,7.525a.134.134,0,0,0,.221-.047h0L16.59,13.076a.32.32,0,0,0,0-.209h0L11.342.024a.05.05,0,0,0-.047-.034h0a.057.057,0,0,0-.057.057Z' transform='translate(-0.013 0.01)' fill-rule='evenodd' fill='url(%23linear-gradient-5)'/%3E%3Cpath id='Path_644' data-name='Path 644' d='M517.729,0h0a.057.057,0,0,0-.057.057l0,9.789a.276.276,0,0,1-.014.081l5.3,2.789L517.776.034A.05.05,0,0,0,517.729,0Zm-.069,9.927,1.012.581Z' transform='translate(-506.451 0)' fill-rule='evenodd' fill='url(%23linear-gradient-6)'/%3E%3Cpath id='Path_645' data-name='Path 645' d='M523.055,461.518v0a.319.319,0,0,0-.016-.1h0l-.067-.166-5.3-2.789,1.015.581Z' transform='translate(-506.461 -448.532)' fill-rule='evenodd' fill='url(%23linear-gradient-7)'/%3E%3Cpath id='Path_646' data-name='Path 646' d='M37.323,532.352l-.293.446,5.023-4.628Z' transform='translate(-36.228 -516.733)' fill='%23be80f5'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Crect id='Rectangle_1110' data-name='Rectangle 1110' width='40' height='40' transform='translate(-20193 -20411)' fill='none'/%3E%3C/g%3E%3C/svg%3E",
    rdns: 'com.ambire.wallet'
  }

  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: Object.freeze({ info, provider: p })
    })
  )
}

window.addEventListener<any>('eip6963:requestProvider', () => {
  isEIP6963 = true
  announceEip6963Provider(ambireProvider)
})

announceEip6963Provider(ambireProvider)

window.dispatchEvent(new Event('ethereum#initialized'))
