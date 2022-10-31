// Injected on dapp page complete,
// to override other web3 wallets (if our first injection got overriden)

if (injectWeb3) {
  injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
} else {
  throw new Error(
    'ambire injectWeb3 was not found or injection.js was not injected first by manifest'
  )
}
