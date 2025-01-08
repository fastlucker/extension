/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */

const ambireIsOpera = /Opera|OPR\//i.test(navigator.userAgent)
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
        return window.ambire
      },
      set() {} // Prevent other wallet providers from throwing errors when attempting to override `window.ethereum`
    })
  } catch (e) {
    console.error(e)
    window.ethereum = window.ambire
  }
}

if (ambireIsOpera) {
  const ambireProxy = new Proxy(window.ambire, {
    get(target, property, receiver) {
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

window.dispatchEvent(new Event('ethereum#initialized'))
