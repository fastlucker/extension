// modified to browser if the web engine is GECKO in the webpack config
let browserAPI = null
let engine = null
let isExtension = false

if (process.env.WEB_ENGINE === 'webkit') {
  browserAPI = chrome
  engine = 'webkit'
}

if (process.env.WEB_ENGINE === 'gecko') {
  browserAPI = browser
  browserAPI.action = browserAPI.browserAction
  engine = 'gecko'
}

// Code running in a Chrome extension (content script, background page, etc.)
// {@link https://stackoverflow.com/a/22563123/1333836}
if (!!browserAPI && browserAPI.runtime && browserAPI.runtime.id) {
  isExtension = true
}

export { browserAPI, engine, isExtension }
