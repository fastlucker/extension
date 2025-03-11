/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */

// if is the Opera browser
if (/Opera|OPR\//i.test(navigator.userAgent)) {
  const ambireProxy = new Proxy(window.ambire, {
    get(target, property, receiver) {
      return Reflect.get(target, property, receiver)
    }
  })

  window.ethereum = ambireProxy
} else {
  const descriptor = Object.getOwnPropertyDescriptor(window, 'ethereum')
  const canDefine = !descriptor || descriptor.configurable

  if (canDefine) {
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
      window.ethereum = window.ambire
    }
  }
  if (!window.web3) window.web3 = { currentProvider: window.ambire }
}

window.dispatchEvent(new Event('ethereum#initialized'))
