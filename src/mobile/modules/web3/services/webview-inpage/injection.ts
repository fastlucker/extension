import networks from 'ambire-common/src/constants/networks'

import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'

import EthereumProvider from './EthereumProvider'

// const instance = new EthereumProvider({ networks, DAPP_PROVIDER_URLS })
// const classDefinition = Object.getPrototypeOf(instance).constructor.toString()

// console.log(classDefinition)

const injectionScript = `
alert('injected')
try {
  const EthereumProvider = ${EthereumProvider.toString()}
  const provider = new EthereumProvider()
  let cacheOtherProvider = null
    const ambireProvider = new Proxy(provider, {
      deleteProperty: (target, prop) => {
        if (prop === 'on' || prop === 'isAmbire') {
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
          window.ethereum[key] = (finalProvider)[key]
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
          window.ethereum[key] = (finalProvider)[key]
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
        ;(finalProvider).on(event, handler)
      })
      provider._cacheRequestsBeforeReady.forEach(({ resolve, reject, data }) => {
        ;(finalProvider).request(data).then(resolve).catch(reject)
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
} catch (error) {
  alert('error when injecting')
}
`
export default injectionScript
