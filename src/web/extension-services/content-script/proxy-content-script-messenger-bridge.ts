//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
import { stripTopicDirection } from '@web/extension-services/messengers/internal/stripTopicDirection'
import { tabMessenger } from '@web/extension-services/messengers/internal/tab'

const handleRelayMessages = async (event: MessageEvent<any>) => {
  if (!chrome?.runtime?.id) return
  if (event.source !== window || event.data?.type !== 'CS_A_TO_CS_B') return

  const { message } = event.data
  if (message.topic !== '> ambireProviderRequest') return

  console.log('original message', message)
  try {
    const response = await tabMessenger.send(stripTopicDirection(message.topic), message.payload)
    console.log('background res', response)
    window.postMessage(
      {
        type: 'CS_B_TO_CS_A',
        topic: `< ${stripTopicDirection(message.topic)}`,
        payload: response
      },
      '*'
    )
  } catch (error) {
    console.error('Content Script B failed to send message to background:', error)
  }
}
window.addEventListener('message', handleRelayMessages)
