/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { browser, engine, getFirefoxVersion } from '@web/constants/browserapi'

const handleRegisterScripts = async () => {
  const scripts: {
    id: string
    allFrames?: boolean
    css?: string[]
    excludeMatches?: string[]
    js?: string[]
    matches?: string[]
    persistAcrossSessions?: boolean
    runAt?: 'document_start' | 'document_end' | 'document_idle'
    world?: 'ISOLATED' | 'MAIN'
  }[] = []

  const registeredScripts = await browser.scripting.getRegisteredContentScripts()

  const firefoxVersion = getFirefoxVersion()

  // Firefox versions older than 128.0 do not support world: MAIN.
  // We handle this using dynamic scripting by injecting:
  // 1. A script with world: MAIN for versions 128.0 or higher.
  // 2. A content script that injects the ambire-inpage and ethereum-inpage scripts into the document for older versions
  const shouldUseWorldMain = engine === 'webkit' || (firefoxVersion && firefoxVersion >= 128)

  if (shouldUseWorldMain) {
    const registeredAmbireInpage = registeredScripts.find((s: any) => s.id === 'ambire-inpage')
    const registeredEthereumInpage = registeredScripts.find((s: any) => s.id === 'ethereum-inpage')
    if (!registeredAmbireInpage) {
      scripts.push({
        id: 'ambire-inpage',
        matches: ['file://*/*', 'http://*/*', 'https://*/*'],
        js: ['ambire-inpage.js'],
        runAt: 'document_start',
        world: 'MAIN'
      })
    }
    if (!registeredEthereumInpage) {
      scripts.push({
        id: 'ethereum-inpage',
        matches: ['file://*/*', 'http://*/*', 'https://*/*'],
        js: ['ethereum-inpage.js'],
        runAt: 'document_start',
        world: 'MAIN'
      })
    }
  } else {
    const registeredContentScriptAmbireInjection = registeredScripts.find(
      (s: any) => s.id === 'content-script-ambire-injection'
    )
    const registeredContentScriptEthereumInjection = registeredScripts.find(
      (s: any) => s.id === 'content-script-ethereum-injection'
    )
    if (!registeredContentScriptAmbireInjection) {
      scripts.push({
        id: 'content-script-ambire-injection',
        allFrames: true,
        matches: ['http://*/*', 'https://*/*'],
        excludeMatches: ['*://doInWebPack.lan/*'],
        js: ['content-script-ambire-injection.js'],
        runAt: 'document_start'
      })
    }
    if (!registeredContentScriptEthereumInjection) {
      scripts.push({
        id: 'content-script-ethereum-injection',
        allFrames: true,
        matches: ['http://*/*', 'https://*/*'],
        excludeMatches: ['*://doInWebPack.lan/*'],
        js: ['content-script-ethereum-injection.js'],
        persistAcrossSessions: false,
        runAt: 'document_start'
      })
    }
  }

  try {
    if (scripts.length) {
      await browser.scripting.registerContentScripts(scripts)
    }
  } catch (err) {
    console.warn(`Failed to inject EthereumProvider: ${err}`)
  }
}

const handleUnregisterAmbireInpageScript = async () => {
  try {
    const firefoxVersion = getFirefoxVersion()
    const shouldUseWorldMain = engine === 'webkit' || (firefoxVersion && firefoxVersion >= 128)

    const registeredScripts = await browser.scripting.getRegisteredContentScripts()

    const registeredAmbireInpage = registeredScripts.find(
      (s: any) =>
        s.id === (shouldUseWorldMain ? 'ambire-inpage' : 'content-script-ambire-injection')
    )
    if (registeredAmbireInpage) {
      await browser.scripting.unregisterContentScripts({
        ids: shouldUseWorldMain ? ['ambire-inpage'] : ['content-script-ambire-injection']
      })
    }
  } catch (err) {
    console.warn(`Failed to unregister ambire-inpage: ${err}`)
  }
}

// mainly used to unregister injection of window.ethereum when Ambire is not the default wallet
const handleUnregisterEthereumInpageScript = async () => {
  try {
    const firefoxVersion = getFirefoxVersion()
    const shouldUseWorldMain = engine === 'webkit' || (firefoxVersion && firefoxVersion >= 128)

    const registeredScripts = await browser.scripting.getRegisteredContentScripts()

    const registeredEthereumInpage = registeredScripts.find(
      (s: any) =>
        s.id === (shouldUseWorldMain ? 'ethereum-inpage' : 'content-script-ethereum-injection')
    )

    if (registeredEthereumInpage) {
      await browser.scripting.unregisterContentScripts({
        ids: shouldUseWorldMain ? ['ethereum-inpage'] : ['content-script-ethereum-injection']
      })
    }
  } catch (err) {
    console.warn(`Failed to inject ethereum-inpage: ${err}`)
  }
}
let executeContentScriptForTabsFromPrevSessionPromise: Promise<void> | undefined

const executeContentScriptForTabsFromPrevSession = async (tab: chrome.tabs.Tab) => {
  if (!tab.id || !tab.url) return

  if (!['http://', 'https://'].some((prefix) => tab.url!.startsWith(prefix))) return

  await executeContentScriptForTabsFromPrevSessionPromise

  try {
    await browser.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['browser-polyfill.min.js', 'content-script.js'],
      injectImmediately: true
    })
  } catch (error) {
    console.error(error)
  } finally {
    executeContentScriptForTabsFromPrevSessionPromise = undefined
  }
}

// This mechanism keeps the content script used for communication between dApps and extension
// up to date across the sessions of the extension and when the service worker/background script
// goes inactive and then reactivates
const handleRegisterContentScriptAcrossSessions = () => {
  browser.tabs.onUpdated.addListener(
    async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      if (changeInfo.status === 'loading') {
        executeContentScriptForTabsFromPrevSessionPromise =
          executeContentScriptForTabsFromPrevSession(tab)
        await executeContentScriptForTabsFromPrevSessionPromise
      }
    }
  )
  browser.tabs.onActivated.addListener(async ({ tabId }: chrome.tabs.TabActiveInfo) => {
    const tab = await browser.tabs.get(tabId)
    executeContentScriptForTabsFromPrevSessionPromise =
      executeContentScriptForTabsFromPrevSession(tab)
    await executeContentScriptForTabsFromPrevSessionPromise
  })

  browser.tabs
    .query({ active: true, currentWindow: true })
    .then(async (tabs: chrome.tabs.Tab[]) => {
      for (const tab of tabs) {
        executeContentScriptForTabsFromPrevSessionPromise =
          executeContentScriptForTabsFromPrevSession(tab)
        await executeContentScriptForTabsFromPrevSessionPromise
      }
    })
}

const handleIsBrowserWindowFocused = async (callback: (isWindowFocused: boolean) => void) => {
  // Track when the browser window gains or loses focus
  browser.windows.onFocusChanged.addListener((windowId: number) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      callback(false)
    } else {
      callback(true)
    }
  })

  const window = await browser.windows.getLastFocused()
  callback(!!window.focused)
}

export {
  handleRegisterScripts,
  handleUnregisterAmbireInpageScript,
  handleUnregisterEthereumInpageScript,
  handleRegisterContentScriptAcrossSessions,
  handleIsBrowserWindowFocused
}
