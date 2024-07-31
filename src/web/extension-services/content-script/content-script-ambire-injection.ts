// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
//

const injectProviderScript = () => {
  // the script element with src won't execute immediately use inline script element instead!
  const container = document.head || document.documentElement
  const ambireInpageScript = document.createElement('script')
  // Otherwise the script will mess with the global scope of the page
  ambireInpageScript.type = 'module'
  ambireInpageScript.setAttribute('async', 'false')

  // '#AMBIREINPAGE#' is a string replaced by webpack
  // via the AssetReplacePlugin with the real content of each file
  ambireInpageScript.textContent = '#AMBIREINPAGE#'
  container.insertBefore(ambireInpageScript, container.children[0])
  container.removeChild(ambireInpageScript)
}

injectProviderScript()
