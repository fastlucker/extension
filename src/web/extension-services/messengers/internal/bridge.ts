import { createMessenger } from '@web/extension-services/messengers/internal/createMessenger'
import { tabMessenger } from '@web/extension-services/messengers/internal/tab'
import { windowMessenger } from '@web/extension-services/messengers/internal/window'
import { detectScriptType } from '@web/extension-services/messengers/utils/detectScriptType'

const messenger = tabMessenger.available ? tabMessenger : windowMessenger

function sendMessageToB(topic, payload) {
  console.log('CONTENT_SCRIPT_A_IS_ABOUT_TO_SEND_TO_CONTENT_SCRIPT_B')
  window.postMessage({ type: 'CS_A_TO_CS_B', topic, payload }, '*')
}

/**
 * Creates a "bridge messenger" that can be used to communicate between
 * scripts where there isn't a direct messaging connection (ie. inpage <-> background).
 *
 * Compatible connections:
 * - ✅ Background <-> Inpage
 * - ❌ Background <-> Content Script
//  * - ❌ Content Script <-> Inpage
 */
export const bridgeMessenger = createMessenger({
  available: messenger.available,
  name: 'bridgeMessenger',
  async send(topic, payload, options) {
    // sendMessageToB(topic, payload)
    return messenger.send(topic, payload, options || {})
  },
  reply(topic, callback) {
    return messenger.reply(topic, callback)
  }
})

export function setupBridgeMessengerRelay() {
  if (detectScriptType() !== 'contentScript') {
    throw new Error('`setupBridgeMessengerRelay` is only supported in Content Scripts.')
  }

  // e.g. inpage -> content script -> background
  windowMessenger.reply('*', async (payload, { topic, id }) => {
    if (!topic) return

    const t = topic.replace('> ', '')
    const response = await tabMessenger.send(t, payload, { id })

    return response
  })

  // e.g. background -> content script -> inpage
  tabMessenger.reply('*', async (payload, { topic, id }) => {
    if (!topic) return

    const t = topic.replace('> ', '')
    const response = await windowMessenger.send(t, payload, { id })

    return response
  })
}
