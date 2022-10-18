// modified to browser if the web engine is GECKO in the webpack config
let browserAPI = null
let engine = null

if (process.env.WEB_ENGINE === 'webkit') {
  browserAPI = chrome
  engine = 'webkit'
}

if (process.env.WEB_ENGINE === 'gecko') {
  browserAPI = browser
  browserAPI.action = browserAPI.browserAction
  engine = 'gecko'
}


export { browserAPI, engine }
