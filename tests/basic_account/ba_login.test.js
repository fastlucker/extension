import { bootstrap } from '../common-helpers/bootstrap'
import { setAmbKeyStore } from '../common-helpers/setAmbKeyStore'
import { typeText } from '../common-helpers/typeText'
import { INVITE_STORAGE_ITEM } from '../constants/constants'
import { createAccountWithInvalidPhrase } from '../common/login'

describe('ba_login', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL, serviceWorker } = await bootstrap('ba_login'))
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

    await page.goto(`${extensionURL}/tab.html#/get-started`)
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  const enterSeedPhraseField = '[data-testid="enter-seed-phrase-field"]'

  //------------------------------------------------------------------------------------------------------
  it('(-) login into account with invalid private key', async () => {
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')

    const typeTextAndCheckValidity = async (privateKey) => {
      await typeText(page, enterSeedPhraseField, privateKey, { delay: 10 })

      // Check whether text "Invalid private key." exists on the page
      await page.$$eval('div[dir="auto"]', (element) => {
        return element.find((item) => item.textContent === 'Invalid private key.').textContent
      })

      // Check whether button is disabled
      const isButtonDisabled = await page.$eval('[data-testid="import-button"]', (button) => {
        return button.getAttribute('aria-disabled')
      })

      expect(isButtonDisabled).toBe('true')
    }

    // Test cases with different private keys
    await typeTextAndCheckValidity(
      '0000000000000000000000000000000000000000000000000000000000000000'
    )
    await page.$eval(enterSeedPhraseField, (el) => (el.value = ''))

    await typeTextAndCheckValidity('', 'Test 2')
    await page.$eval(enterSeedPhraseField, (el) => (el.value = ''))

    await typeTextAndCheckValidity(
      '00390ce7b96835258b010e25f9196bf4ddbff575b7c102546e9e40780118018'
    )
    await new Promise((r) => setTimeout(r, 1000))
    await page.$eval(enterSeedPhraseField, (el) => (el.value = ''))

    await typeTextAndCheckValidity(
      '03#90ce7b96835258b019e25f9196bf4ddbff575b7c102546e9e40780118018'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Login into basic account with invalid phrase', async () => {
    await createAccountWithInvalidPhrase(page)
  })
})
