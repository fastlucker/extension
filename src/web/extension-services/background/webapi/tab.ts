// @ts-nocheck

import { browser, isSafari } from '@web/constants/browserapi'

import { closeCurrentWindow } from './window'

const createTab = async (url): Promise<number | undefined> => {
  const tab = await browser.tabs.create({ active: true, url })

  return tab?.id
}

const openIndexPage = (route = ''): Promise<number | undefined> => {
  const url = `index.html${route && `#/${route}`}`

  return createTab(url)
}

const getCurrentTab = async (): Promise<Tabs.Tab> => {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })

    return tabs[0]
  } catch (error) {
    // TODO: add appropriate error handling that will notify the user
  }
}

export const openInTab = async (url, needClose = true): Promise<Tabs.Tab> => {
  const tab = await browser.tabs.create({ active: true, url })
  if (needClose) {
    if (!isSafari()) await closeCurrentWindow()
  }

  return tab
}

const routeableSearchParams = ['flow', 'goBack']

const openInternalPageInTab = async (route?: string, useWebapi = true, searchParams = {}) => {
  if (useWebapi) {
    const searchToParams = searchParams
      ? `${Object.keys(searchParams)
          .map((key) =>
            routeableSearchParams.indexOf(key) !== -1 ? `${key}=${searchParams[key]}` : ''
          )
          .filter((value: string) => value)
          .join('&')}`
      : ''

    /* eslint-disable @typescript-eslint/no-floating-promises */
    openInTab(
      `./tab.html${route ? `#/${route}${searchToParams !== '' ? `?${searchToParams}` : ''}` : ''}`
    )
  } else {
    window.open(`./tab.html${route ? `#/${route}` : ''}`)
  }
}

const getAllOpenedTabs = async (): Promise<Tabs.Tab[]> => {
  return browser.tabs.query({})
}

export { createTab, openIndexPage, getCurrentTab, openInternalPageInTab, getAllOpenedTabs }
