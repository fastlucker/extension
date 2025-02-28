//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
//
import { stripTopicDirection } from '@web/extension-services/messengers/internal/stripTopicDirection'
import { tabMessenger } from '@web/extension-services/messengers/internal/tab'

const handleRelayMessages = async (event: MessageEvent<any>) => {
  if (event.data?.type === 'removeEventListener') {
    window.removeEventListener('message', handleRelayMessages)
    return
  }

  if (event.source !== window || event.data?.type !== 'CS_A_TO_CS_B') return

  if (!chrome?.runtime?.id) return

  const { message } = event.data
  if (message.topic !== 'ambireProviderRequest') return

  try {
    const response = await tabMessenger.send(stripTopicDirection(message.topic), message.payload, {
      id: message.id
    })
    window.postMessage({ type: 'CS_B_TO_CS_A', payload: response }, '*')
  } catch (error) {
    console.error('Content Script B failed to send message to background:', error)
  }
}

window.postMessage({ type: 'removeEventListener' }, '*')
console.log('inject proxy content script')
setTimeout(() => {
  window.addEventListener('message', handleRelayMessages)
}, 0)

// e.g. background -> content script -> inpage
tabMessenger.reply('*', async (payload, { topic }) => {
  if (!topic) return

  const t = topic.replace('> ', '')

  if (t !== 'broadcast') return
  return window.postMessage({ type: 'BROADCAST_CS_B_TO_CS_A', payload, topic: 'broadcast' }, '*')
})
