// @ts-nocheck

// Content Script is mainly a relayer between pageContext and background worker
// on initialization it injects a script in the currently opened page

import { BACKGROUND, CONTENT_SCRIPT } from '../constants/paths'
import { sendMessage, setupAmbexMessenger } from './ambexMessanger'

const contentScript = async () => {
  setupAmbexMessenger(CONTENT_SCRIPT)

  // Informs BACKGROUND that the CONTENT_SCRIPT is injected
  sendMessage({ type: 'contentScriptInjected', to: BACKGROUND }).then((reply) => {
    if (reply.data && reply.data.ack) {
      // Injects pageContext, when background replies to the contentScriptInjected message
      injectWeb3(chrome.runtime.id, `${chrome.runtime.id}-response`)
    }
  })
}

// Execute the contentScript function
contentScript()
