/* eslint-disable import/no-mutable-exports */
// @ts-nocheck

import browser from 'webextension-polyfill'

const browserAPI = chrome || browser
let engine: 'webkit' | 'gecko' | null = null
let isExtension: boolean = false
let isManifestV3: boolean = false

try {
  isManifestV3 = browserAPI.runtime?.getManifest()?.manifest_version === 3

  if (process.env.WEB_ENGINE === 'webkit') {
    engine = 'webkit'
  }

  if (process.env.WEB_ENGINE === 'gecko') {
    engine = 'gecko'
  }

  // Code running in a Chrome extension (content script, background page, etc.)
  // {@link https://stackoverflow.com/a/22563123/1333836}

  if (browserAPI?.runtime?.id) {
    isExtension = true
  }
} catch (error) {
  // Silent fail
}

export { engine, isExtension, isManifestV3, browserAPI }
