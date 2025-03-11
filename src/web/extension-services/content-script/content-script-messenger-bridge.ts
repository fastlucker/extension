//
// Content Script from bridging the messaging process between ambire-inpage/ethereum-inpage and the service_worker/background script
//
import { setupBridgeMessengerRelay } from '../messengers/internal/bridge'

setupBridgeMessengerRelay()

let lastMoveTime = 0
const MOVE_INTERVAL = 1000

// when the background is inactive this mechanism will reactivate it
const reactivateBackground = () => {
  const now = Date.now()

  if (now - lastMoveTime > MOVE_INTERVAL) {
    lastMoveTime = now
    if (!chrome?.runtime?.id) {
      document.removeEventListener('mousemove', reactivateBackground)
      return
    }

    chrome.runtime.sendMessage('mouseMoved').catch(() => {
      // Service worker might be inactive; this error is expected.
    })
  }
}
document.addEventListener('mousemove', reactivateBackground)
