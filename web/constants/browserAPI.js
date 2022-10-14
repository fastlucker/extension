export const browserAPI = process.env.WEB_ENGINE === 'gecko' ? browser : chrome

// FF compatibility
if (process.env.WEB_ENGINE === 'gecko') {
  browserAPI.action = browserAPI.browserAction
}
