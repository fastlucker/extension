/* eslint-disable import/no-mutable-exports */
// @ts-nocheck

let browserAPI: any = null
let engine: 'webkit' | 'gecko' | null = null
let isExtension: boolean = false

if (process.env.WEB_ENGINE === 'webkit') {
  browserAPI = chrome
  engine = 'webkit'
}

if (process.env.WEB_ENGINE === 'gecko') {
  // When running in Chrome, although the engine is 'webkit',
  // and the code inside this block should NOT execute,
  // the `browserAPI = browser` assignment is causing an extension crash.
  // So wrapping it in a try-catch block fixes this.
  try {
    browserAPI = browser
    browserAPI.action = browserAPI.browserAction
    engine = 'gecko'
  } catch {
    // Fail silently.
  }
}

// Code running in a Chrome extension (content script, background page, etc.)
// {@link https://stackoverflow.com/a/22563123/1333836}
if (!!browserAPI && browserAPI.runtime && browserAPI.runtime.id) {
  isExtension = true
}

export { browserAPI, engine, isExtension }
