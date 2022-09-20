import { browserAPI } from '../constants/browserAPI.js'

export const DEFERRED_PERMISSION_WINDOWS = {}
export const PERMISSION_WINDOWS = {}

async function deferTick(host, queue, route) {
  if (DEFERRED_PERMISSION_WINDOWS[host]) {
    DEFERRED_PERMISSION_WINDOWS[host] = false
    const zoom = 0.7
    const popupWidth = 600 * zoom
    const popupHeight = 830 * zoom

    // getting last focused window to position our popup correctly
    const lastFocused = await browserAPI.windows.getLastFocused()

    const windowMarginRight = 20
    const windowMarginTop = 80

    const popupLeft = lastFocused.left + lastFocused.width - popupWidth - windowMarginRight
    const popupTop = lastFocused.top + windowMarginTop

    const createData = {
      type: 'panel',
      url: `index.html?initialRoute=${route}&host=${host}&queue=${btoa(JSON.stringify(queue))}`,
      width: popupWidth,
      height: popupHeight,
      left: popupLeft,
      top: popupTop
    }

    const creating = browserAPI.windows.create(createData)

    creating.then((c) => {
      PERMISSION_WINDOWS[host] = c.id
      // FF does not place popup correctly on creation so we force update...
      browserAPI.windows.update(c.id, {
        left: popupLeft,
        top: popupTop,
        focused: true,
        drawAttention: true
      })
    })
  }
}

// Dirty hack because of concurrent threads when windows.create that would result in multiple windows popping up
export function deferCreateWindow(host, queue, route) {
  if (!DEFERRED_PERMISSION_WINDOWS[host]) {
    DEFERRED_PERMISSION_WINDOWS[host] = {
      ts: new Date().getTime(),
      count: 0
    }
  } else {
    DEFERRED_PERMISSION_WINDOWS[host].count++
  }
  setTimeout(() => {
    deferTick(host, queue, route)
  }, 100)
}
