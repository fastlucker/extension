// @ts-nocheck

// Content Script is mainly a relayer between pageContext(injected script) and the background service_worker
// Middleware for handling messages between dapps and the extension's background process
import { browserAPI, engine } from '@web/constants/browserAPI'
import { CONTENT_SCRIPT } from '@web/constants/paths'
import { setupAmbexMessenger } from '@web/services/ambexMessanger'

const WORKER_KEEP_ALIVE_INTERVAL = 1000
const WORKER_KEEP_ALIVE_MESSAGE = 'WORKER_KEEP_ALIVE_MESSAGE'

const contentScript = async () => {
  setupAmbexMessenger(CONTENT_SCRIPT)

  const initKeepWorkerAlive = () => {
    setInterval(() => {
      browserAPI.runtime.sendMessage({ name: WORKER_KEEP_ALIVE_MESSAGE })
    }, WORKER_KEEP_ALIVE_INTERVAL)
  }

  // Keeps service_worker alive (prevents it to become inactive)
  if (engine === 'webkit') {
    initKeepWorkerAlive()
  }
}

// Execute the contentScript function
contentScript()
