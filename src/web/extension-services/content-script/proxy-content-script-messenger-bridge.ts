//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
//
import { stripTopicDirection } from '@web/extension-services/messengers/internal/stripTopicDirection'
import { tabMessenger } from '@web/extension-services/messengers/internal/tab'

const handleRelayMessages = async (event: MessageEvent<any>) => {
  if (event.source !== window || event.data?.type !== 'CS_A_TO_CS_B') return

  if (event.data?.type === 'removeEventListener') {
    window.removeEventListener('message', handleRelayMessages)
  }

  const { message } = event.data
  if (message.topic !== 'ambireProviderRequest') return

  try {
    const response = await tabMessenger.send(stripTopicDirection(message.topic), message.payload)
    window.postMessage({ type: 'CS_B_TO_CS_A', payload: response }, '*')
  } catch (error) {
    console.error('Content Script B failed to send message to background:', error)
  }
}

window.postMessage({ type: 'removeEventListener', payload: null }, '*')
console.log('inject proxy content script')
window.addEventListener('message', handleRelayMessages)
