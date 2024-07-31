/* eslint-disable import/no-mutable-exports */
let browser: any = null
let engine: 'webkit' | 'gecko' | null = null
let isExtension: boolean = false

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
    if (browser?.runtime?.id) isExtension = true
  }
} catch (error) {
  // Silent fail
}

const getFirefoxVersion = () => {
  const ua = navigator.userAgent
  if (!ua) return undefined

  try {
    const match = ua.match(/Firefox\/(\d+\.\d+)/)

    if (match) return parseInt(match[1], 10)

    return undefined
  } catch (error) {
    return undefined
  }
}

export { engine, isExtension, browser, getFirefoxVersion }
