import { bootstrap } from '../common-helpers/bootstrap'
import { INVITE_STORAGE_ITEM } from '../constants/constants'

import { createAccountWithInvalidPhrase } from '../common/login.js'

describe('sa_login', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  beforeEach(async () => {
    ;({ browser, extensionURL, serviceWorker, recorder, page } = await bootstrap('sa_login'))
    // Bypass the invite verification step
    await serviceWorker.evaluate(
      (invite) =>
        chrome.storage.local.set({
          invite,
          isE2EStorageSet: true,
          isPinned: 'true',
          isSetupComplete: 'true'
        }),
      JSON.stringify(INVITE_STORAGE_ITEM)
    )

    const getStartedPage = `${extensionURL}/tab.html#/get-started`
    await page.goto(getStartedPage)
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Login into smart account with invalid phrase', async () => {
    await createAccountWithInvalidPhrase(page)
  })
})
