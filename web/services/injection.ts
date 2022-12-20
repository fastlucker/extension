// @ts-nocheck

// Injected at the very beginning and ending of the currently
// opened page/tab by the chrome.scripting.registerContentScripts located in the service_worker
const inPageWeb3Injection = () => {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('page-context.js')
  script.id = 'page-context'

  document.documentElement.appendChild(script)
}

inPageWeb3Injection()
