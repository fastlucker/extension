import { bootstrap, INVITE_STORAGE_ITEM } from '../functions.js'

import {
  createAccountWithPhrase,
  createAccountWithInvalidPhrase,
  addViewOnlyAccount
} from '../common/login.js'

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

  //------------------------------------------------------------------------------------------------------
  it('create smart account with phrase', async () => {
    await createAccountWithPhrase(page, extensionURL, process.env.SA_PASSPHRASE)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Login into smart account with invalid phrase', async () => {
    await createAccountWithInvalidPhrase(page)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('add view-only smart account', async () => {
    await addViewOnlyAccount(page, extensionURL, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
  })
})
