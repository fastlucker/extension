import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import { bootstrap, INVITE_STORAGE_ITEM } from '../functions.js'

import {
  createAccountWithPhrase,
  createAccountWithInvalidPhrase,
  addViewOnlyAccount
} from '../common.js'

describe('sa_login', () => {
  let browser
  let page
  let extensionRootUrl
  let extensionId
  let recorder

  beforeEach(async () => {
    const context = await bootstrap()
    browser = context.browser
    extensionRootUrl = context.extensionRootUrl
    extensionId = context.extensionId

    page = await browser.newPage()

    recorder = new PuppeteerScreenRecorder(page)
    await recorder.start(`./recorder/sa_login_${Date.now()}.mp4`)

    const getStartedPage = `chrome-extension://${extensionId}/tab.html#/get-started`
    await page.goto(getStartedPage)

    // Bypass the invite verification step
    await page.evaluate((invite) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      chrome.storage.local.set({ invite })
    }, JSON.stringify(INVITE_STORAGE_ITEM))

    await new Promise((r) => {
      setTimeout(r, 3000)
    })
    await page.bringToFront()
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //------------------------------------------------------------------------------------------------------
  it('create smart account with phrase', async () => {
    await createAccountWithPhrase(page, extensionRootUrl, process.env.SA_PASSPHRASE)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Login into smart account with invalid phrase', async () => {
    await createAccountWithInvalidPhrase(page)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('add view-only smart account', async () => {
    await addViewOnlyAccount(page, extensionRootUrl, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
  })
})
