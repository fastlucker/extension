// Content Script is mainly a relayer between pageContext and background worker

;(async () => {
  const { VERBOSE } = await import('../constants/env.js')
  const { setupAmbexMessenger, sendMessage } = await import('./ambexMessanger.js')

  setupAmbexMessenger('contentScript')

  // tell background that we are injected
  sendMessage({ type: 'contentScriptInjected', to: 'background' }).then((reply) => {
    console.warn('should tell bg we are injected')

    if (reply.data && reply.data.ack) {
      if (VERBOSE) console.log('CS : got ack injecting web3...')
      // injecting pageContext, when background replies
      injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
    }
  })
})()
