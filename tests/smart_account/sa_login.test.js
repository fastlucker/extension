import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import { bootstrap, INVITE_STORAGE_ITEM } from '../functions.js'

import {
  createAccountWithPhrase,
  createAccountWithInvalidPhrase,
  addViewOnlyAccount
} from '../common/login.js'

describe('sa_login', () => {
  let browser, page, extensionRootUrl, extensionId, recorder

  beforeEach(async () => {
    ;({ browser, extensionRootUrl, extensionId, backgroundTarget } = await bootstrap())
    const backgroundPage = await backgroundTarget.page()
    // Bypass the invite verification step
    await backgroundPage.evaluate(
      (invite) => chrome.storage.local.set({ invite }),
      JSON.stringify(INVITE_STORAGE_ITEM)
    )

    page = await browser.newPage()
    page.setDefaultTimeout(120000)

    recorder = new PuppeteerScreenRecorder(page)
    await recorder.start(`./recorder/sa_login_${Date.now()}.mp4`)

    const getStartedPage = `chrome-extension://${extensionId}/tab.html#/get-started`
    await page.goto(getStartedPage)
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
