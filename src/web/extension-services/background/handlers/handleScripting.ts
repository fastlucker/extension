import { Session } from '@ambire-common/classes/session'
import { browser, engine, getFirefoxVersion } from '@web/constants/browserapi'

import { storage } from '../webapi/storage'

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
  if (!registeredScripts.length) {
    const prevDappSessions: { [key: string]: Session } = await storage.get('dappSessions', {})
    // Remove previous dappSessions from storage to ensure that on the next service worker load,
    // only the dappSessions from the last service worker instance are retrieved.
    await storage.remove('dappSessions')
    // eslint-disable-next-line no-restricted-syntax
    for (const { tabId } of Object.values(prevDappSessions)) {
      // eslint-disable-next-line no-continue
      if (!tabId) continue
      try {
        // eslint-disable-next-line no-await-in-loop
        await chrome.scripting.executeScript({
          target: { tabId, allFrames: true },
          files: ['proxy-content-script.js'],
          injectImmediately: true
        })
      } catch (error) {
        console.error(`Failed to execute script into tab ${tabId}:`, error)
      }
    }
  }
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

export {
  handleRegisterScripts,
  handleUnregisterAmbireInpageScript,
  handleUnregisterEthereumInpageScript
}
