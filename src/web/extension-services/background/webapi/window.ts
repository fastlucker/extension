import { EventEmitter } from 'events'

import { browser, isManifestV3 } from '@web/constants/browserapi'
import { IS_WINDOWS } from '@web/constants/common'
import {
  MIN_NOTIFICATION_WINDOW_HEIGHT,
  NOTIFICATION_WINDOW_HEIGHT,
  NOTIFICATION_WINDOW_WIDTH
} from '@web/constants/spacings'

const event = new EventEmitter()

// if focus other windows, then reject the notification request
browser.windows.onFocusChanged.addListener((winId: any) => {
  event.emit('windowFocusChange', winId)
})

browser.windows.onRemoved.addListener((winId: any) => {
  event.emit('windowRemoved', winId)
})

export const WINDOW_SIZE = {
  width: NOTIFICATION_WINDOW_WIDTH + (IS_WINDOWS ? 14 : 0), // idk why windows cut the width.
  height: NOTIFICATION_WINDOW_HEIGHT
}

// creates a browser new window that is 15% smaller
// of the current page and is centered in the browser app
const createFullScreenWindow = async ({ url, ...rest }: any) => {
  let screenWidth = 0
  let screenHeight = 0

  if (isManifestV3) {
    const displayInfo = await chrome.system.display.getInfo()
    screenWidth = displayInfo?.[0]?.workArea?.width
    screenHeight = displayInfo?.[0]?.workArea?.height
  } else {
    screenWidth = window.screen.width
    screenHeight = window.screen.height
  }

  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      const ratio = 0.88 // 88% of the screen/tab size

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
            desiredWidth = activeTab.width * ratio
            leftPosition = (activeTab.width - desiredWidth) / 2 + leftOffset
            desiredHeight = activeTab.height * ratio
            topPosition =
              (activeTab.height - desiredHeight) / 2 +
              topOffset +
              currentWindow.height -
              activeTab.height
          }

          const height =
            Math.round(desiredHeight) > MIN_NOTIFICATION_WINDOW_HEIGHT
              ? Math.round(desiredHeight)
              : MIN_NOTIFICATION_WINDOW_HEIGHT

          const width =
            Math.round(desiredWidth) > NOTIFICATION_WINDOW_WIDTH
              ? Math.round(desiredWidth)
              : NOTIFICATION_WINDOW_WIDTH

          chrome.windows.create(
            {
              focused: true,
              url,
              type: 'popup',
              ...rest,
              width,
              height,
              left: Math.round(leftPosition),
              top: Math.round(topPosition),
              state: 'normal'
            },
            // @ts-ignore
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
  const win: any = await createFullScreenWindow({ url, ...rest })
  return win.id
}

const remove = async (winId: number) => {
  return browser.windows.remove(winId)
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
