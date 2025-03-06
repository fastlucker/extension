//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
//
import { setupBridgeMessengerRelay } from '../messengers/internal/bridge'

setupBridgeMessengerRelay()

let lastMoveTime = 0
const MOVE_INTERVAL = 1000

// when the background is inactive this mechanism will reactivate it
document.addEventListener('mousemove', () => {
  const now = Date.now()

  if (now - lastMoveTime > MOVE_INTERVAL) {
    lastMoveTime = now
    chrome.runtime.sendMessage('mouseMoved').catch(() => {
      // Service worker might be inactive; this error is expected.
    })
  }
})
