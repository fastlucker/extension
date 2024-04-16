import { EventEmitter } from 'events'

import { SPACING } from '@common/styles/spacings'
import { browser, isManifestV3 } from '@web/constants/browserapi'
import { IS_WINDOWS } from '@web/constants/common'
import {
  MIN_NOTIFICATION_WINDOW_HEIGHT,
  NOTIFICATION_WINDOW_HEIGHT,
  NOTIFICATION_WINDOW_WIDTH,
  TAB_WIDE_CONTENT_WIDTH
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

const setScreenHeight = (h: number) => {
  try {
    const height = h > MIN_NOTIFICATION_WINDOW_HEIGHT ? h : MIN_NOTIFICATION_WINDOW_HEIGHT

    return Math.round(height)
  } catch (error) {
    return Math.round(MIN_NOTIFICATION_WINDOW_HEIGHT)
  }
}

const setScreenWidth = (w: number) => {
  try {
    if (w < NOTIFICATION_WINDOW_WIDTH) {
      return Math.round(NOTIFICATION_WINDOW_WIDTH)
    }
    if (w > TAB_WIDE_CONTENT_WIDTH) {
      return Math.round(TAB_WIDE_CONTENT_WIDTH)
    }

    return Math.round(w)
  } catch (error) {
    return Math.round(NOTIFICATION_WINDOW_WIDTH)
  }
}

// creates a browser new window that is 15% smaller
// of the current page and is centered in the browser app
const createFullScreenWindow = async ({ url, ...rest }: any) => {
  let screenWidth = 0
  let screenHeight = 0

  if (isManifestV3) {
    const displayInfo = await chrome.system.display.getInfo()
    screenWidth = setScreenWidth(displayInfo?.[0]?.workArea?.width)
    screenHeight = setScreenHeight(displayInfo?.[0]?.workArea?.height)
  } else {
    screenWidth = setScreenWidth(window.screen.width)
    screenHeight = setScreenHeight(window.screen.height)
  }

  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
      const ratio = 0.88 // 88% of the screen/tab size

      let desiredWidth = setScreenWidth(screenWidth * ratio)
      let desiredHeight = setScreenHeight(screenHeight * ratio)

      let leftPosition = (screenWidth - desiredWidth) / 2
      let topPosition = (screenHeight - desiredHeight) / 2

      const activeTab = activeTabs[0]
      if (!chrome.runtime.lastError && activeTab) {
        chrome.windows.getCurrent(
          { populate: true, windowTypes: ['normal', 'panel', 'app'] },
          (currentWindow: any) => {
            let leftOffset = 0
            let topOffset = 0
            if (currentWindow) {
              leftOffset = currentWindow.left
              topOffset = currentWindow.top
            }

            if (activeTab.width && activeTab.height) {
              desiredWidth = setScreenWidth(activeTab.width * ratio)
              leftPosition = (activeTab.width - desiredWidth) / 2 + leftOffset
              desiredHeight = setScreenHeight(activeTab.height * ratio)
              topPosition =
                (activeTab.height - desiredHeight) / 2 +
                topOffset +
                currentWindow.height -
                activeTab.height
            }

            chrome.windows.create(
              {
                focused: true,
                url,
                type: 'popup',
                ...rest,
                width: desiredWidth,
                height: desiredHeight,
                left: leftPosition <= SPACING ? Math.round(SPACING) : Math.round(leftPosition),
                top: topPosition <= SPACING ? Math.round(SPACING) : Math.round(topPosition),
                state: 'normal'
              },
              // @ts-ignore
              (win) => {
                resolve(win)
              }
            )
          }
        )
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

const focusNotificationWindow = (windowId: number) => {
  chrome.windows.update(windowId, { focused: true })
}

export default {
  openNotification,
  focusNotificationWindow,
  event,
  remove
}
