// injected on dapp page complete, to override other web3 wallets (if our first injection got overriden)
const injectWeb3 = async (evtToPage, evtFromPage) => {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('./page-context.js')

  script.dataset.args = JSON.stringify({ evtToPage, evtFromPage })
  document.documentElement.appendChild(script)
}

injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
