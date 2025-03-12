if (/Opera|OPR\//i.test(navigator.userAgent)) {
  window.ethereum = new Proxy(window.ambire, { get: (t, p, r) => Reflect.get(t, p, r) })
} else {
  const d = Object.getOwnPropertyDescriptor(window, 'ethereum')
  if (!d || d.configurable) {
    Object.defineProperty(window, 'ethereum', {
      configurable: false,
      enumerable: true,
      get: () => window.ambire,
      set: () => {}
    })
  }
  window.web3 ||= { currentProvider: window.ambire }
}
window.dispatchEvent(new Event('ethereum#initialized'))
