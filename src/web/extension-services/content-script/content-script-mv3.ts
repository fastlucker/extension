//
// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
//

import { setupBridgeMessengerRelay } from '../messengers/internal/bridge'

setupBridgeMessengerRelay()
