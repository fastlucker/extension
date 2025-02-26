//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
import { stripTopicDirection } from '@web/extension-services/messengers/internal/stripTopicDirection'
import { tabMessenger } from '@web/extension-services/messengers/internal/tab'

// Listen for messages from Content Script A
window.addEventListener('message', async (event) => {
  if (event.source !== window || event.data?.type !== 'CS_A_TO_CS_B') return

  const { message } = event.data
  console.log('Content Script B received from A:', message.topic, message.payload)

  try {
    const response = await tabMessenger.send(stripTopicDirection(message.topic), message.payload)
    console.log('response from background', response)
    window.postMessage(
      { type: 'CS_B_TO_CS_A', topic: `< ${stripTopicDirection(message.topic)}`, payload: response },
      '*'
    )
  } catch (error) {
    console.error('Content Script B failed to send message to background:', error)
  }
})
