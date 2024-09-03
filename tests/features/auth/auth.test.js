import { completeOnboardingSteps } from '../../common-helpers/completeOnboardingSteps'
import {
  URL_GET_STARTED,
  URL_ACCOUNT_SELECT,
  INVITE_STORAGE_ITEM,
  INVITE_STATUS_VERIFIED,
  TEST_ACCOUNT_NAME_ONE,
  TEST_ACCOUNT_NAME_TWO,
  TEST_ID_ENTER_SEED_PHRASE_FIELD_PLACEHOLDER
} from './constants'
import { bootstrap } from '../../common-helpers/bootstrap'
import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
import {
  finishStoriesAndSelectAccount,
  typeSeedWords,
  expectImportButtonToBeDisabled
} from './functions'
import { setAmbKeyStore } from '../../common-helpers/setAmbKeyStore'
import { baPrivateKey, seed } from '../../config/constants'
import { buildSelector } from '../../common-helpers/buildSelector'
import { SELECTORS, TEST_IDS } from '../../common/selectors/selectors'

describe('auth', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL, serviceWorker } = await bootstrap('auth'))
    // Bypass the invite verification step
    await serviceWorker.evaluate(
      (invite) => chrome.storage.local.set({ invite, isE2EStorageSet: true }),
      JSON.stringify(INVITE_STORAGE_ITEM)
    )

    await page.goto(`${extensionURL}${URL_GET_STARTED}`)
  })

  afterEach(async () => {
    await recorder.stop()
    // await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('should import basic account from private key', async () => {
    // expect.assertions(4)

    // Get the invite data from the storage
    const inviteFromStorage = await serviceWorker.evaluate(() => chrome.storage.local.get('invite'))
    expect(Object.keys(inviteFromStorage).length).toBe(1)

    // Expect invitation code to be verified
    const parsedInvitation = JSON.parse(inviteFromStorage.invite)
    expect(parsedInvitation.status).toBe(INVITE_STATUS_VERIFIED)

    await setAmbKeyStore(page, SELECTORS.importPrivateBtn)
    await page.waitForSelector(SELECTORS.enterSeedPhraseField)

    const enterSeedPhraseFieldPlaceholder = await page.$eval(
      SELECTORS.enterSeedPhraseField,
      (el) => el.placeholder
    )
    // Expect the locator selects the right field where to enter the private key
    expect(enterSeedPhraseFieldPlaceholder).toBe(TEST_ID_ENTER_SEED_PHRASE_FIELD_PLACEHOLDER)

    await typeText(page, SELECTORS.enterSeedPhraseField, baPrivateKey)

    // Click on Import button.
    await clickOnElement(page, SELECTORS.importBtn)

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, undefined, false)

    // Since v4.31.0, Ambire does NOT retrieve smart accounts from private keys.
    expect(firstSelectedSmartAccount).toBeNull()

    // Click on "Save and Continue" button
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)

    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })
    // Wait for account addresses to load
    await new Promise((r) => {
      setTimeout(r, 2000)
    })

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(SELECTORS.account, (el) => el[0].innerText)
    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('should import one Basic Account and one Smart Account from a seed phrase and personalize them', async () => {
    await setAmbKeyStore(page, SELECTORS.buttonProceedSeedPhrase)
    await page.waitForSelector('[placeholder="Word 1"]')

    await typeSeedWords(page, seed)

    // Click on Import button.
    await clickOnElement(page, SELECTORS.importBtn)

    await new Promise((r) => setTimeout(r, 500)) // so that the modal appears

    await clickOnElement(page, SELECTORS.doNotSaveSeedBtn)

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, true)

    const accountName1 = TEST_ACCOUNT_NAME_ONE
    const accountName2 = TEST_ACCOUNT_NAME_TWO

    const btnProceedSeedPhraseWithIndexZeroSelector = buildSelector(
      TEST_IDS.editBtnForEditNameField,
      0
    )
    const btnProceedSeedPhraseWithIndexOneSelector = buildSelector(
      TEST_IDS.editBtnForEditNameField,
      1
    )
    const editFieldNameFieldWithIndexZeroSelector = buildSelector(TEST_IDS.editFieldNameField, 0)
    const editFieldNameFieldWithIndexOneSelector = buildSelector(TEST_IDS.editFieldNameField, 1)

    await clickOnElement(page, btnProceedSeedPhraseWithIndexZeroSelector)
    await typeText(page, editFieldNameFieldWithIndexZeroSelector, accountName1)

    await clickOnElement(page, btnProceedSeedPhraseWithIndexOneSelector)
    await typeText(page, editFieldNameFieldWithIndexOneSelector, accountName2)

    // Click on the checkmark icon to save the new account names
    await clickOnElement(page, btnProceedSeedPhraseWithIndexZeroSelector)
    await clickOnElement(page, btnProceedSeedPhraseWithIndexOneSelector)

    // Click on "Save and Continue" button
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, `${SELECTORS.saveAndContinueBtn}:not([disabled])`)

    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page and contains the new names
    const selectedBasicAccount = await page.$$eval(SELECTORS.account, (el) => el[0].innerText)
    expect(selectedBasicAccount).toContain(accountName1)

    const selectedSmartAccount = await page.$$eval(SELECTORS.account, (el) => el[1].innerText)

    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)
    expect(selectedBasicAccount).toContain(accountName1)
    expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
    expect(selectedSmartAccount).toContain(accountName2)
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('should import view-only accounts', async () => {
    const smartAccount = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'

    const basicAccount = '0x048d8573402CE085A6c8f34d568eC2Ccc995196e'

    await completeOnboardingSteps(page)

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    // Select "Add"
    await clickOnElement(page, SELECTORS.getStartedBtnAdd)

    await typeText(page, SELECTORS.addressEnsField, smartAccount)

    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, SELECTORS.viewOnlyBtnImport)

    await clickOnElement(page, SELECTORS.saveAndContinueBtn)

    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    await page.waitForSelector(SELECTORS.address)
    // Verify that added accounts exist on the page and contains 'View-only'
    let selectedBasicAccount = await page.$eval(SELECTORS.account, (el) => el.innerText)

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain('View-only')

    await clickOnElement(page, SELECTORS.buttonAddAccount)

    await clickOnElement(page, SELECTORS.watchAddress, true, 1500)
    await typeText(page, SELECTORS.addressEnsField, basicAccount)
    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, SELECTORS.viewOnlyBtnImport)
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)
    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    // Verify that added accounts exist on the page and contains 'View-only'
    selectedBasicAccount = await page.$$eval(SELECTORS.account, (el) => el[0].innerText)

    const selectedSmartAccount = await page.$$eval(SELECTORS.account, (el) => el[1].innerText)

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain('View-only')
    expect(selectedSmartAccount).toContain(basicAccount)
    expect(selectedSmartAccount).toContain('View-only')
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should not allow importing an invalid seed phrase', async () => {
    await setAmbKeyStore(page, SELECTORS.buttonProceedSeedPhrase)

    await page.waitForSelector('[placeholder="Word 1"]')

    // This function waits until an error message appears on the page.
    async function waitUntilError(validateMessage) {
      await page.waitForFunction(
        (text) => {
          const element = document.querySelector('body')
          return element && element.textContent.includes(text)
        },
        { timeout: 60000 },
        validateMessage
      )
    }

    // Try to login with empty phrase fields
    let passphraseWords = ''
    await typeSeedWords(page, passphraseWords)
    await expectImportButtonToBeDisabled(page)

    // Test cases with different phrases keys
    passphraseWords =
      '00000 000000 00000 000000 00000 000000 00000 000000 00000 000000 00000 000000'
    await typeSeedWords(page, passphraseWords)
    await expectImportButtonToBeDisabled(page)

    const errorMessage = 'Invalid Seed Phrase. Please review every field carefully.'
    // Wait until the error message appears on the page
    await waitUntilError(errorMessage)

    // Clear the passphrase fields before write the new phrase
    const wordArray = passphraseWords.split(' ')
    for (let i = 0; i < wordArray.length; i++) {
      const inputSelector = `[placeholder="Word ${i + 1}"]`
      await page.click(inputSelector, { clickCount: 3 }) // Select all content
      await page.keyboard.press('Backspace') // Delete the selected content
    }

    passphraseWords =
      'allow survey play weasel exhibit helmet industry bunker fish step garlic ababa'
    await typeSeedWords(page, passphraseWords)
    await expectImportButtonToBeDisabled(page)
    // Wait until the error message appears on the page
    await waitUntilError(errorMessage)
  })
  //------------------------------------------------------------------------------------------------------
  it.skip('should not allow importing an invalid private key', async () => {
    await setAmbKeyStore(page, SELECTORS.importPrivateBtn)

    const typeTextAndCheckValidity = async (privateKey) => {
      await typeText(page, SELECTORS.enterSeedPhraseField, privateKey, { delay: 10 })

      // Check whether text "Invalid private key." exists on the page
      await page.$$eval('div[dir="auto"]', (element) => {
        return element.find((item) => item.textContent === 'Invalid private key.').textContent
      })

      // Check whether button is disabled
      const isButtonDisabled = await page.$eval(SELECTORS.importBtn, (button) => {
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
})
