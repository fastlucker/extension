import { INVITE_STORAGE_ITEM } from '../constants/constants'
import { bootstrap } from '../common-helpers/bootstrap'
import { clickOnElement } from '../common-helpers/clickOnElement'
import { typeText } from '../common-helpers/typeText'
import {
  finishStoriesAndSelectAccount,
  typeSeedWords,
  expectImportButtonToBeDisabled
} from './auth-helper'
import { setAmbKeyStore } from '../common-helpers/setAmbKeyStore'

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

    await page.goto(`${extensionURL}/tab.html#/get-started`)
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import basic account from private key', async () => {
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.BA_PRIVATE_KEY)

    // Click on Import button.
    await clickOnElement(page, '[data-testid="import-button"]')

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, undefined, false)

    // Since v4.31.0, Ambire does NOT retrieve smart accounts from private keys.
    expect(firstSelectedSmartAccount).toBeNull()

    // Click on "Save and Continue" button
    await clickOnElement(page, '[data-testid="button-save-and-continue"]')

    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })
    // Wait for account addresses to load
    await new Promise((r) => {
      setTimeout(r, 2000)
    })

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import one Basic Account and one Smart Account from a seed phrase and personalize them', async () => {
    await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')
    await page.waitForSelector('[placeholder="Word 1"]')

    await typeSeedWords(page, process.env.SEED)

    // Click on Import button.
    await clickOnElement(page, '[data-testid="import-button"]')

    await new Promise((r) => setTimeout(r, 500)) // so that the modal appears
    await clickOnElement(page, '[data-testid="do-not-save-seed-button"]')

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, true)

    const accountName1 = 'Test-Account-1'
    const accountName2 = 'Test-Account-2'

    const editAccountNameFields = await page.$$('[data-testid="editable-button"]')

    await editAccountNameFields[0].click()
    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '[data-testid="edit-name-field-0"]', accountName1)

    await editAccountNameFields[1].click()
    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '[data-testid="edit-name-field-1"]', accountName2)

    // Click on the checkmark icon to save the new account names
    editAccountNameFields[0].click()
    editAccountNameFields[1].click()

    // Click on "Save and Continue" button
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page and contains the new names
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(accountName1)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )

    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)
    expect(selectedBasicAccount).toContain(accountName1)
    expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
    expect(selectedSmartAccount).toContain(accountName2)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import view-only accounts', async () => {
    const smartAccount = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'

    const basicAccount = '0x048d8573402CE085A6c8f34d568eC2Ccc995196e'

    // Click on "Next" button several times to finish the onboarding.
    await clickOnElement(page, '[data-testid="stories-button-next-0"]')
    await clickOnElement(page, '[data-testid="stories-button-next-1"]')
    await clickOnElement(page, '[data-testid="stories-button-next-2"]')
    await clickOnElement(page, '[data-testid="stories-button-next-3"]')
    await clickOnElement(page, '[data-testid="stories-button-next-4"]')

    // check the checkbox "I agree ..."
    await page.$eval('[data-testid="checkbox"]', (button) => button.click())

    // Click on "Got it"
    await clickOnElement(page, '[data-testid="stories-button-next-5"]')

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    // Select "Add"
    await clickOnElement(page, '[data-testid="get-started-button-add"]')

    await typeText(page, '[data-testid="address-ens-field"]', smartAccount)

    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, '[data-testid="view-only-button-import"]')

    await clickOnElement(page, '[data-testid="button-save-and-continue"]')

    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    await page.waitForSelector('[data-testid="address"]')
    // Verify that added accounts exist on the page and contains 'View-only'
    let selectedBasicAccount = await page.$eval('[data-testid="account"]', (el) => el.innerText)

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain('View-only')

    await clickOnElement(page, '[data-testid="button-add-account"]')

    await clickOnElement(page, '[data-testid="watch-address"]', true, 1500)
    await typeText(page, '[data-testid="address-ens-field"]', basicAccount)
    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, '[data-testid="view-only-button-import"]')
    await clickOnElement(page, '[data-testid="button-save-and-continue"]')
    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that added accounts exist on the page and contains 'View-only'
    selectedBasicAccount = await page.$$eval('[data-testid="account"]', (el) => el[0].innerText)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain('View-only')
    expect(selectedSmartAccount).toContain(basicAccount)
    expect(selectedSmartAccount).toContain('View-only')
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should not allow importing an invalid seed phrase', async () => {
    await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

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
  it('should not allow importing an invalid private key', async () => {
    const enterSeedPhraseField = '[data-testid="enter-seed-phrase-field"]'
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
})
