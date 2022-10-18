// Injected at the very beginning by the manifest, defining global var used for other scripts
window.injectWeb3 = async (evtToPage, evtFromPage) => {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('page-context.js')
  script.id = 'page-context'

  script.dataset.args = JSON.stringify({ evtToPage, evtFromPage })

  document.documentElement.appendChild(script)
}
