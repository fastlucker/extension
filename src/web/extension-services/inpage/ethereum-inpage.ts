/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */

import { ConnectButtonReplacementController } from '@web/extension-services/inpage/controllers/connectButtonReplacement/connectButtonReplacement'

const ambireIsOpera = /Opera|OPR\//i.test(navigator.userAgent)

const connectButtonReplacementCtrl = new ConnectButtonReplacementController({
  isEIP6963: false
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

const setAmbireProvider = () => {
  try {
    Object.defineProperty(window, 'ethereum', {
      configurable: false,
      enumerable: true,
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

        return window.ambire
      }
    })
  } catch (e) {
    console.error(e)
    window.ethereum = window.ambire
  }
}

if (ambireIsOpera) {
  const ambireProxy = new Proxy(window.ambire, {
    get(target, property, receiver) {
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

      return Reflect.get(target, property, receiver)
    }
  })

  window.ethereum = ambireProxy
} else {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum')
  const canDefine = !descriptor || descriptor.configurable

  if (canDefine) setAmbireProvider()
  if (!window.web3) window.web3 = { currentProvider: window.ambire }
}

window.addEventListener<any>('eip6963:requestProvider', () => {
  connectButtonReplacementCtrl.update({ isEIP6963: true })
})

window.dispatchEvent(new Event('ethereum#initialized'))
