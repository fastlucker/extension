//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
//

import { bridgeMessenger, setupBridgeMessengerRelay } from '../messengers/internal/bridge'

// Listen for messages from Content Script B
// window.addEventListener('message', async (event) => {
//   if (event.source !== window || event.data?.type !== 'CS_B_TO_CS_A') return

//   const { topic, payload } = event.data
//   console.log('Content Script A received response from B:', topic, payload)
//   // Relay the response to the inpage script
//   bridgeMessenger.send(topic, payload)
// })

setupBridgeMessengerRelay()
