import { ReplyMessage } from '@ambire-common/interfaces/messenger'
import { createMessenger } from '@web/extension-services/messengers/internal/createMessenger'
import { isValidReply } from '@web/extension-services/messengers/internal/isValidReply'
import { tabMessenger } from '@web/extension-services/messengers/internal/tab'
import { windowMessenger } from '@web/extension-services/messengers/internal/window'
import { detectScriptType } from '@web/extension-services/messengers/utils/detectScriptType'

const messenger = tabMessenger.available ? tabMessenger : windowMessenger

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

    if (chrome.runtime.id) {
      const response: any = await tabMessenger.send(t, payload, { id })

      return response
    }

    return new Promise<any>((resolve, reject) => {
      const listener = (e: any) => {
        if (e.source !== window || e.data?.type !== 'CS_B_TO_CS_A') return
        const message = {
          id: e.data.payload.id,
          topic: '< ambireProviderRequest',
          payload: { response: e.data.payload }
        } as ReplyMessage<any>

        if (!isValidReply<any>({ id, message, topic: t })) return
        window.removeEventListener('message', listener)

        const { response: r, error } = message.payload
        if (error) reject(new Error(error.message))
        resolve(r)
        return true
      }

      window.addEventListener('message', listener)

      window.postMessage({ type: 'CS_A_TO_CS_B', message: { topic: t, payload, id } }, '*')
    })
  })

  // e.g. background -> content script -> inpage
  tabMessenger.reply('*', async (payload, { topic, id }) => {
    if (!topic) return

    const t = topic.replace('> ', '')
    const response = await windowMessenger.send(t, payload, { id })

    return response
  })

  const handleRelayedMessages = async (event: MessageEvent<any>) => {
    if (event.source !== window || event.data?.type !== 'BROADCAST_CS_B_TO_CS_A') return

    const { payload, topic } = event.data
    if (topic !== 'broadcast') return

    const response = await windowMessenger.send(topic, payload)

    return response
  }

  window.addEventListener('message', handleRelayedMessages)
}
