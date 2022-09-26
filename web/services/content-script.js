// Content Script is mainly a relayer between pageContext and background worker
// const { VERBOSE } = await import('../constants/env.js')
// const { setupAmbexMessenger, sendMessage } = await import('./ambexMessanger.js')
// const { CONTENT_SCRIPT, BACKGROUND } = await import('../constants/paths.js')
import { VERBOSE } from '../constants/env'
import { setupAmbexMessenger, sendMessage } from './ambexMessanger'
import { CONTENT_SCRIPT, BACKGROUND } from '../constants/paths'
;

(async () => {
  setupAmbexMessenger(CONTENT_SCRIPT)

  // Tells background that we are injected
  sendMessage({ type: 'contentScriptInjected', to: BACKGROUND }).then((reply) => {
    console.warn('should tell bg we are injected')

    if (reply.data && reply.data.ack) {
      if (VERBOSE) console.log('CS : got ack injecting web3...')
      // Injects pageContext, when background replies
      injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
    }
  })
})()
