// Injected at the very beginning by the manifest, defining global var used for other scripts
window.injectWeb3 = async (evtToPage, evtFromPage) => {
  const web3Script = document.createElement('script')
  web3Script.src = chrome.runtime.getURL('modules/web3.min.js')
  document.documentElement.appendChild(web3Script)

  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('services/page-context.js')
  script.id = 'page-context'

  script.dataset.args = JSON.stringify({ evtToPage, evtFromPage })

  document.documentElement.appendChild(script)
}
