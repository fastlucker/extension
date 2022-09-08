// Content Script is mainly a relayer between pageContext and background worker
const injectWeb3 = async (evtToPage, evtFromPage) => {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('./page-context.js')

  script.dataset.args = JSON.stringify({ evtToPage, evtFromPage })
  document.documentElement.appendChild(script)
}

;(async () => {
  import(/* webpackIgnore: true */ './ambexMessanger.js')
    .then((res) => {
      const VERBOSE = 4

      res.setupAmbexMessenger('contentScript')

      // tell background that we are injected
      res.sendMessage({ type: 'contentScriptInjected', to: 'background' }).then((reply) => {
        console.warn('should tell bg we are injected')

        if (reply.data && reply.data.ack) {
          if (VERBOSE) console.log('CS : got ack injecting web3...')
          // injecting pageContext, when background replies
          injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
        }
      })
    })
    .catch((e) => {
      console.error('Content script: ', e)
    })
})()
