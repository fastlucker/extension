import { engine, getFirefoxVersion } from '@web/constants/browserapi'

const handleRegisterScripts = async (skipInjectingMessengerBridgeScript?: boolean) => {
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
  }[] = skipInjectingMessengerBridgeScript
    ? []
    : [
        {
          id: 'content-script-messenger-bridge',
          allFrames: true,
          matches: ['http://*/*', 'https://*/*'],
          excludeMatches: ['*://doInWebPack.lan/*'],
          js: ['browser-polyfill.min.js', 'content-script.js'],
          runAt: 'document_start'
        }
      ]

  const firefoxVersion = getFirefoxVersion()
  const shouldUseWorldMain = engine === 'webkit' || (firefoxVersion && firefoxVersion >= 128)

  if (shouldUseWorldMain) {
    scripts.push({
      id: 'ambire-inpage',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['ambire-inpage.js'],
      runAt: 'document_start',
      world: 'MAIN'
    })
    scripts.push({
      id: 'ethereum-inpage',
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['ethereum-inpage.js'],
      runAt: 'document_start',
      world: 'MAIN'
    })
  } else {
    scripts.push({
      id: 'content-script-ambire-injection',
      allFrames: true,
      matches: ['http://*/*', 'https://*/*'],
      excludeMatches: ['*://doInWebPack.lan/*'],
      js: ['content-script-ambire-injection.js'],
      runAt: 'document_start'
    })
    scripts.push({
      id: 'content-script-ethereum-injection',
      allFrames: true,
      matches: ['http://*/*', 'https://*/*'],
      excludeMatches: ['*://doInWebPack.lan/*'],
      js: ['content-script-ethereum-injection.js'],
      runAt: 'document_start'
    })
  }

  try {
    await browser.scripting.registerContentScripts(scripts)
  } catch (err) {
    console.warn(`Failed to inject EthereumProvider: ${err}`)
  }
}

const handleUnregisterAmbireInpageScript = async () => {
  try {
    const firefoxVersion = getFirefoxVersion()
    const shouldUseWorldMain = engine === 'webkit' || (firefoxVersion && firefoxVersion >= 128)

    await browser.scripting.unregisterContentScripts({
      ids: shouldUseWorldMain ? ['ambire-inpage'] : ['content-script-ambire-injection']
    })
  } catch (err) {
    console.warn(`Failed to unregister ambire-inpage: ${err}`)
  }
}

const handleUnregisterEthereumInpageScript = async () => {
  try {
    const firefoxVersion = getFirefoxVersion()
    const shouldUseWorldMain = engine === 'webkit' || (firefoxVersion && firefoxVersion >= 128)

    await browser.scripting.unregisterContentScripts({
      ids: shouldUseWorldMain ? ['ethereum-inpage'] : ['content-script-ethereum-injection']
    })
  } catch (err) {
    console.warn(`Failed to inject ethereum-inpage: ${err}`)
  }
}

export {
  handleRegisterScripts,
  handleUnregisterAmbireInpageScript,
  handleUnregisterEthereumInpageScript
}
