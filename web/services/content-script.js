// Content Script is mainly a relayer between pageContext and background worker
// on initialization it injects a script in the currently opened page

import { VERBOSE } from '../constants/env'
import { setupAmbexMessenger, sendMessage } from './ambexMessanger'
import { CONTENT_SCRIPT, BACKGROUND } from '../constants/paths'

const contentScript = async () => {
  setupAmbexMessenger(CONTENT_SCRIPT)

  // Informs BACKGROUND that the CONTENT_SCRIPT is injected
  sendMessage({ type: 'contentScriptInjected', to: BACKGROUND }).then((reply) => {
    console.warn('should tell bg we are injected')

    if (reply.data && reply.data.ack) {
      if (VERBOSE) console.log('CS : got ack injecting web3...')
      // Injects pageContext, when background replies to the contentScriptInjected message
      injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
    }
  })
}

// Execute the contentScript function
contentScript()
