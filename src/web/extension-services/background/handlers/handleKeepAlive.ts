import { browser, isSafari } from '@web/constants/browserapi'

function saveTimestamp() {
  const timestamp = new Date().toISOString()

  browser.storage.session.set({ timestamp })
}

export const handleKeepAlive = () => {
  if (isSafari()) {
    const INTERNAL_STAYALIVE_PORT: string = 'CT_Internal_port_alive'
    let alivePort: chrome.runtime.Port | null = null

    const SECONDS = 1000
    let isFirstStart = true
    let timer = 4 * SECONDS
    let wakeup: any

    // eslint-disable-next-line no-inner-declarations
    async function Highlander() {
      if (alivePort == null) {
        alivePort = chrome.runtime.connect({ name: INTERNAL_STAYALIVE_PORT })

        alivePort.onDisconnect.addListener(() => {
          alivePort = null
        })
      }

      if (alivePort) alivePort.postMessage({ content: 'ping' })

      if (isFirstStart) {
        isFirstStart = false
        clearInterval(wakeup)
        timer = 270 * SECONDS
        wakeup = setInterval(Highlander, timer)
      }
    }

    wakeup = setInterval(Highlander, timer)
  } else {
    saveTimestamp()
    // Save the timestamp immediately and then every `SAVE_TIMESTAMP_INTERVAL`
    // miliseconds. This keeps the service worker alive.
    const SAVE_TIMESTAMP_INTERVAL_MS = 2 * 1000
    setInterval(saveTimestamp, SAVE_TIMESTAMP_INTERVAL_MS)
  }
}
