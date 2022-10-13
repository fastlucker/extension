export const browserAPI = process.env.WEB_ENGINE === 'gecko' ? browser : chrome

// FF compatibility
if (process.env.WEB_ENGINE === 'gecko') {
  browserAPI.action = browserAPI.browserAction
}

console.log('process.env.WEB_ENGINE === gecko', process.env.WEB_ENGINE === 'gecko')
