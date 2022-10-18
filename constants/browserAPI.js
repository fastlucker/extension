// modified to browser if the web engine is GECKO in the webpack config
let browserAPI = null

if (typeof browser !== 'undefined') {
  browserAPI = browser
}

if (typeof chrome !== 'undefined') {
  browserAPI = chrome
}

// FF compatibility
if (process.env.WEB_ENGINE === 'gecko') {
  browserAPI.action = browserAPI.browserAction
}


export { browserAPI }
