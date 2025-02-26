//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
//
// import { tabMessenger } from '@web/extension-services/messengers/internal/tab'

// Listen for messages from Content Script A
// window.addEventListener('message', async (event) => {
//   if (event.source !== window || event.data?.type !== 'CS_A_TO_CS_B') return

//   const { topic, payload } = event.data
//   console.log('Content Script B received from A:', topic, payload)

//   // try {
//   //   // Send message to background
//   //   // const response = await tabMessenger.send(topic, payload)

//   //   // Send response back to Content Script A
//   //   // window.postMessage({ type: 'CS_B_TO_CS_A', topic, payload: response }, '*')
//   // } catch (error) {
//   //   console.error('Content Script B failed to send message to background:', error)
//   // }
// })
