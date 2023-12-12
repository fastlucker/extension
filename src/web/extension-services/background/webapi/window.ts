import { EventEmitter } from 'events'

import { IS_WINDOWS } from '@web/constants/common'
import { NOTIFICATION_WINDOW_HEIGHT, NOTIFICATION_WINDOW_WIDTH } from '@web/constants/spacings'

const event = new EventEmitter()

// if focus other windows, then reject the notification request
chrome.windows.onFocusChanged.addListener((winId) => {
  event.emit('windowFocusChange', winId)
})

chrome.windows.onRemoved.addListener((winId) => {
  event.emit('windowRemoved', winId)
})

export const WINDOW_SIZE = {
  width: NOTIFICATION_WINDOW_WIDTH + (IS_WINDOWS ? 14 : 0), // idk why windows cut the width.
  height: NOTIFICATION_WINDOW_HEIGHT
}

// creates a browser new window that is 15% smaller
// of the current page and is centered in the browser app
const createFullScreenWindow = async ({ url, ...rest }: any) => {
  const displayInfo = await chrome.system.display.getInfo()
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      const ratio = 0.88 // 88% of the screen/tab size

      const screenWidth = displayInfo?.[0]?.workArea?.width
      const screenHeight = displayInfo?.[0]?.workArea?.height

      let desiredWidth = screenWidth * ratio
      let desiredHeight = screenHeight * ratio

      let leftPosition = (screenWidth - desiredWidth) / 2
      let topPosition = (screenHeight - desiredHeight) / 2

      const activeTab = activeTabs[0]
      if (!chrome.runtime.lastError && activeTab !== undefined) {
        chrome.windows.getCurrent({ populate: true }, (currentWindow: any) => {
          let leftOffset = 0
          let topOffset = 0
          if (currentWindow) {
            leftOffset = currentWindow.left
            topOffset = currentWindow.top
          }
          if (activeTab.width && activeTab.height) {
            // if tab size is smaller than 60% of the screen size don't override the default desiredWidth and desiredHeight
            if (activeTab.width > screenWidth * 0.6 && activeTab.height > screenHeight * 0.6) {
              desiredWidth = activeTab.width * ratio
              leftPosition = (activeTab.width - desiredWidth) / 2 + leftOffset
              desiredHeight = activeTab.height * ratio
              topPosition =
                (activeTab.height - desiredHeight) / 2 +
                topOffset +
                currentWindow.height -
                activeTab.height
            }
          }
          chrome.windows.create(
            {
              focused: true,
              url,
              type: 'popup',
              ...rest,
              width: Math.round(desiredWidth),
              height: Math.round(desiredHeight),
              left: Math.round(leftPosition),
              top: Math.round(topPosition),
              state: 'normal'
            },
            (win) => {
              resolve(win)
            }
          )
        })
      }
    })
  })
}

const create = async ({ url, ...rest }: any): Promise<number | undefined> => {
  const {
    top: cTop,
    left: cLeft,
    width
  } = await chrome.windows.getCurrent({
    windowTypes: ['normal']
  })

  const top = cTop
  const left = cLeft! + width! - WINDOW_SIZE.width

  // const currentWindow = await chrome.windows.getCurrent()
  // For the new Ambire v2 we need a full-screen notification window to
  // display the all UI elements of the sign txn/msg screens therefore we hardcode it to 'fullscreen'
  const currentWindow: any = {}
  currentWindow.state = 'fullscreen'

  let win: any
  if (currentWindow.state === 'fullscreen') {
    // chrome.windows.create not pass state to chrome
    win = await createFullScreenWindow({ url, ...rest })
  } else {
    win = await chrome.windows.create({
      focused: true,
      url,
      type: 'popup',
      top,
      left,
      ...WINDOW_SIZE,
      ...rest
    })
  }
  // shim firefox
  if (win.left !== left && currentWindow.state !== 'fullscreen') {
    await chrome.windows.update(win.id!, { left, top })
  }

  return win.id
}

const remove = async (winId: number) => {
  return chrome.windows.remove(winId)
}

const openNotification = ({ route = '', ...rest } = {}): Promise<number | undefined> => {
  const url = `notification.html${route ? `#/${route}` : ''}`

  return create({ url, ...rest })
}

export default {
  openNotification,
  event,
  remove
}
