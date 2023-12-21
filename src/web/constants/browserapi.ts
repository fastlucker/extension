/* eslint-disable import/no-mutable-exports */
let browser: any = null
let engine: 'webkit' | 'gecko' | null = null
let isExtension: boolean = false
let isManifestV3: boolean = false

try {
  if (process.env.WEB_ENGINE === 'webkit') {
    engine = 'webkit'
  }

  if (process.env.WEB_ENGINE === 'gecko') {
    engine = 'gecko'
  }

  if (['webkit', 'gecko'].includes(process.env.WEB_ENGINE || '')) {
    // eslint-disable-next-line
    browser = require('webextension-polyfill')
    // Code running in a Chrome extension (content script, background page, etc.)
    // {@link https://stackoverflow.com/a/22563123/1333836}
    if (browser?.runtime?.id) {
      isManifestV3 = browser.runtime?.getManifest()?.manifest_version === 3
      isExtension = true
    }
  }
} catch (error) {
  // Silent fail
}

export { engine, isExtension, isManifestV3, browser }
