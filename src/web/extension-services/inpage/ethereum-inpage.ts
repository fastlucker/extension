/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */

import {
  ConnectButtonReplacementController,
  forceReplacementForPages
} from '@web/extension-services/inpage/controllers/connectButtonReplacement/connectButtonReplacement'

import { EthereumProvider } from './EthereumProvider'

export type DefaultWallet = 'AMBIRE' | 'OTHER'

declare let defaultWallet: DefaultWallet
// On mv3 the defaultWallet here will always be AMBIRE because the logic is handled via the scripting mechanism in the background
let _defaultWallet: DefaultWallet = 'AMBIRE'

const ambireIsOpera = /Opera|OPR\//i.test(navigator.userAgent)

const connectButtonReplacementCtrl = new ConnectButtonReplacementController({
  isEIP6963: false,
  defaultWallet: _defaultWallet
})

Object.defineProperty(window, 'defaultWallet', {
  configurable: false,
  get() {
    return _defaultWallet
  },
  set(value: DefaultWallet) {
    _defaultWallet = value
    connectButtonReplacementCtrl.update({ defaultWallet: _defaultWallet })
    if (value === 'AMBIRE' && forceReplacementForPages.includes(window.location.origin)) {
      connectButtonReplacementCtrl.init()
    }
  }
})

export interface Interceptor {
  onRequest?: (data: any) => any
  onResponse?: (res: any, data: any) => any
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

let cacheOtherProvider: EthereumProvider | null = null
const ambireProvider = window.ambire

const setAmbireProvider = () => {
  try {
    Object.defineProperty(window, 'ethereum', {
      configurable: false,
      enumerable: true,
      set(val) {
        if (val?._isAmbire) {
          return
        }
        cacheOtherProvider = val
      },
      get() {
        // script to determine whether the page is a dapp or not
        // (only pages that are dapps should read the ethereum provider)
        // the provider is called from multiple instances (current page and other extensions)
        // we need only the calls from the current page
        if (!connectButtonReplacementCtrl.doesWebpageReadOurProvider) {
          try {
            throw new Error()
          } catch (error: any) {
            const stack = error.stack // Parse the stack trace to get the caller info
            if (stack) {
              const callerPage = stack.split('\n')[2].trim()
              if (callerPage.includes(window.location.hostname)) {
                connectButtonReplacementCtrl.doesWebpageReadOurProvider = true
                connectButtonReplacementCtrl.init()
              }
            }
          }
        }

        return defaultWallet === 'AMBIRE' ? ambireProvider : cacheOtherProvider || ambireProvider
      }
    })
  } catch (e) {
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
  patchProvider(ambireProvider)
}

const initProvider = () => {
  let finalProvider: EthereumProvider | null = null

  if (window.ethereum && !window.ethereum._isAmbire) {
    cacheOtherProvider = window.ethereum
  }

  finalProvider = ambireProvider
  patchProvider(ambireProvider)

  const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum')
  const canDefine = !descriptor || descriptor.configurable

  if (canDefine) setAmbireProvider()
  if (!window.web3) window.web3 = { currentProvider: finalProvider }
}
if (ambireIsOpera) {
  initOperaProvider()
} else {
  initProvider()
}

window.addEventListener<any>('eip6963:requestProvider', () => {
  connectButtonReplacementCtrl.update({ isEIP6963: true })
})

window.dispatchEvent(new Event('ethereum#initialized'))
