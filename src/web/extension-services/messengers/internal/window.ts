import { CallbackFunction, createMessenger, SendMessage } from './createMessenger'
import { isValidReply } from './isValidReply'
import { isValidSend } from './isValidSend'

/**
 * Creates a "window messenger" that can be used to communicate between
 * scripts where `window` is defined.
 *
 * Compatible connections:
 * - ❌ Popup <-> Inpage
 * - ❌ Background <-> Inpage
 * - ❌ Background <-> Popup
 * - ❌ Popup <-> Content Script
 * - ❌ Background <-> Content Script
 * - ✅ Content Script <-> Inpage
 */
export const windowMessenger = createMessenger({
  available: typeof window !== 'undefined',
  name: 'windowMessenger',
  async send(topic, payload, { id } = {}) {
    // Since the window messenger cannot reply asynchronously, we must include the direction in our message ('> {topic}')...
    window.postMessage({ topic: `> ${topic}`, payload, id }, '*')
    // ... and also set up an event listener to listen for the response ('< {topic}').
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        if (!isValidReply({ id, message: event.data, topic })) return
        // eslint-disable-next-line eqeqeq
        if (event.source != window) return

        window.removeEventListener('message', listener)

        const { response, error } = event.data.payload
        if (error) reject(new Error(error.message))
        resolve(response)
      }
      window.addEventListener('message', listener)
    })
  },
  reply<TPayload, TResponse>(topic: string, callback: CallbackFunction<TPayload, TResponse>) {
    const listener = async (event: MessageEvent<SendMessage<TPayload>>) => {
      if (!isValidSend({ message: event.data, topic })) return

      const sender = event.source
      // eslint-disable-next-line eqeqeq
      if (sender != window) return

      let error
      let response
      try {
        response = await callback(event.data.payload, {
          topic: event.data.topic,
          sender,
          id: event.data.id
        })
      } catch (error_) {
        error = error_
      }

      const repliedTopic = event.data.topic.replace('>', '<')
      window.postMessage({
        topic: repliedTopic,
        payload: { error, response },
        id: event.data.id
      })
    }
    window.addEventListener('message', listener, false)
    return () => window.removeEventListener('message', listener)
  }
})
