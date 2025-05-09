import path from 'path'

import { chromium, Page } from '@playwright/test'

const EXTENSION_PATH = path.resolve(__dirname, '../../build/webkit-dev')
const USER_DATA_DIR = '' // you can set a temp dir if needed

export async function bootstrap(namespace: string): Promise<{
  page: Page
  extensionURL: string
  serviceWorker: any
}> {
  // 1. Launch persistent context with extension
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--disable-features=DialMediaRouteProvider',
      '--clipboard-write=granted',
      '--clipboard-read=prompt',
      '--detectOpenHandles',
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--ignore-certificate-errors',
      '--window-size=1920,1080'
    ]
  })

  if (!context) {
    throw new Error('Failed to create persistent browser context')
  }

  // 2. Wait for service worker to load
  let serviceWorker
  for (let i = 0; i < 50; i++) {
    serviceWorker = context
      .serviceWorkers()
      .find((sw) => sw.url().startsWith('chrome-extension://'))
    if (serviceWorker) break
    await new Promise((res) => setTimeout(res, 100))
  }

  if (!serviceWorker) {
    throw new Error('Service worker not found after waiting')
  }

  const extensionId = serviceWorker.url().split('/')[2]
  const extensionURL = `chrome-extension://${extensionId}`

  // 3. Open extension page
  const page = await context.newPage()
  page.setDefaultTimeout(120000)

  // 4. Attach console logging from service worker
  try {
    serviceWorker.on('console', (msg) => {
      console.log(`[service-worker] ${msg.text()}`)
    })
  } catch (err) {
    console.warn('Console logging for service worker not available:', err)
  }

  return { page, extensionURL, serviceWorker }
}
