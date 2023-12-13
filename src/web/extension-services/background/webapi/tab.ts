// @ts-nocheck

import { EventEmitter } from 'events'

import { browserAPI } from '@web/constants/browserapi'

const tabEvent = new EventEmitter()

try {
  browserAPI.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) {
      tabEvent.emit('tabUrlChanged', tabId, changeInfo.url)
    }
  })

  // window close will trigger this event also
  browserAPI.tabs.onRemoved.addListener((tabId) => {
    tabEvent.emit('tabRemove', tabId)
  })
} catch (error) {
  // Silent fail
}

const createTab = async (url): Promise<number | undefined> => {
  const tab = await browserAPI.tabs.create({
    active: true,
    url
  })

  return tab?.id
}

const openIndexPage = (route = ''): Promise<number | undefined> => {
  const url = `index.html${route && `#/${route}`}`

  return createTab(url)
}

const getCurrentTab = async (): Promise<Tabs.Tab> => {
  try {
    const tabs = await browserAPI.tabs.query({
      active: true,
      currentWindow: true
    })
    return tabs[0]
  } catch (error) {
    // Silent fail
  }
}

export const openInTab = async (url, needClose = true): Promise<Tabs.Tab> => {
  const tab = await browserAPI.tabs.create({
    active: true,
    url
  })

  if (needClose) window.close()

  return tab
}

const getCurrentWindow = async (): Promise<number | undefined> => {
  const { id } = await browserAPI.windows.getCurrent({
    windowTypes: ['popup']
  } as Windows.GetInfo)

  return id
}

const openInternalPageInTab = (route?: string, useWebapi = true) => {
  if (useWebapi) {
    openInTab(`./tab.html${route ? `#/${route}` : ''}`)
  } else {
    window.open(`./tab.html${route ? `#/${route}` : ''}`)
  }
}

export { createTab, openIndexPage, getCurrentWindow, getCurrentTab, openInternalPageInTab }

export default tabEvent
