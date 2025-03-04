/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { MainController } from '@ambire-common/controllers/main/main'
import { Messenger } from '@ambire-common/interfaces/messenger'
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
  const registeredContentScriptMessengerBridge = registeredScripts.find(
    (s: any) => s.id === 'content-script-messenger-bridge'
  )

  if (!registeredContentScriptMessengerBridge) {
    scripts.push({
      id: 'content-script-messenger-bridge',
      allFrames: true,
      matches: ['http://*/*', 'https://*/*'],
      excludeMatches: ['*://doInWebPack.lan/*'],
      js: ['browser-polyfill.min.js', 'content-script.js'],
      runAt: 'document_start'
    })
  }

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

const executeContentScriptForTabsFromPrevSession = async (
  mainCtrl: MainController,
  tab: chrome.tabs.Tab,
  bridgeMessenger: Messenger
) => {
  if (!tab.id || !tab.url) return

  if (!['http://', 'https://'].some((prefix) => tab.url!.startsWith(prefix))) return

  await browser.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ['browser-polyfill.min.js', 'content-script.js'],
    injectImmediately: true
  })
  const tabOrigin = new URL(tab.url).origin
  const session = mainCtrl.dapps.getOrCreateDappSession({ tabId: tab.id, origin: tabOrigin })
  mainCtrl.dapps.setSessionMessenger(session.sessionId, bridgeMessenger)
  if (!mainCtrl.keystore.isUnlocked) mainCtrl.dapps.broadcastDappSessionEvent('lock')
}

const handleRestoreDappConnection = (mainCtrl: MainController, bridgeMessenger: Messenger) => {
  const tabIdsFromPrevSession: number[] = []
  browser.tabs.query({}).then(async (tabs: chrome.tabs.Tab[]) => {
    for (const tab of tabs) {
      if (tab.id) tabIdsFromPrevSession.push(tab.id)
    }
  })

  browser.tabs.onActivated.addListener(async ({ tabId }: chrome.tabs.TabActiveInfo) => {
    if (tabId && tabIdsFromPrevSession.includes(tabId)) {
      const tab = await browser.tabs.get(tabId)
      await executeContentScriptForTabsFromPrevSession(mainCtrl, tab, bridgeMessenger)
    }
  })
}

export {
  handleRegisterScripts,
  handleUnregisterAmbireInpageScript,
  handleUnregisterEthereumInpageScript,
  handleRestoreDappConnection
}
