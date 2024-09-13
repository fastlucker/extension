import { completeOnboardingSteps } from '../../common-helpers/completeOnboardingSteps'
import {
  URL_GET_STARTED,
  URL_ACCOUNT_SELECT,
  INVITE_STORAGE_ITEM,
  INVITE_STATUS_VERIFIED,
  TEST_ACCOUNT_NAMES,
  TEST_ID_ENTER_SEED_PHRASE_FIELD_PLACEHOLDER,
  INVALID_SEEDS_12_WORDS,
  INVALID_SEEDS_24_WORDS,
  SMART_ACC_VIEW_ONLY_ADDRESS,
  BASIC_ACC_VIEW_ONLY_ADDRESS,
  VIEW_ONLY_LABEL,
  INVALID_PRIV_KEYS,
  INVALID_PRIVATE_KEY_ERROR_MSG,
  INVALID_ACC_ADDRESS,
  INVALID_CHECKSUM_ERROR_MSG,
  INVALID_ADDRESS_OR_UD_DOMAIN_ERROR_MSG,
  SUCCESSFULLY_ADDED_2_ACCOUNTS_MSG
} from './constants'
import { bootstrap } from '../../common-helpers/bootstrap'
import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
import { checkStorageKeysExist } from '../../common-helpers/checkStorageKeysExist'
import {
  finishStoriesAndSelectAccount,
  importAccountsFromSeedPhrase,
  wait,
  checkTextAreaHasValidInputByGivenText,
  importNewSAFromDefaultSeedAndPersonalizeIt,
  personalizeAccountName,
  createHotWalletWithSeedPhrase,
  checkAccountDetails
} from './functions'
import { setAmbKeyStore } from '../../common-helpers/setAmbKeyStore'
import { baPrivateKey, SEED_12_WORDS, SEED_24_WORDS } from '../../config/constants'
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
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import basic account from private key', async () => {
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

    // Test with invalid keys first
    // eslint-disable-next-line no-restricted-syntax
    for (const privKey of INVALID_PRIV_KEYS) {
      // eslint-disable-next-line no-await-in-loop
      await checkTextAreaHasValidInputByGivenText(
        page,
        privKey,
        SELECTORS.enterSeedPhraseField,
        SELECTORS.importBtn,
        INVALID_PRIVATE_KEY_ERROR_MSG
      )
    }

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
    await wait(2000)

    // Verify that selected accounts exist on the page
    await checkAccountDetails(page, SELECTORS.account, [firstSelectedBasicAccount])
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import one Basic Account and one Smart Account from a 12 words seed phrase and personalize them', async () => {
    await importAccountsFromSeedPhrase(page, extensionURL, SEED_12_WORDS, INVALID_SEEDS_12_WORDS)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import one Basic Account and one Smart Account from a 24 words seed phrase and personalize them', async () => {
    await importAccountsFromSeedPhrase(page, extensionURL, SEED_24_WORDS, INVALID_SEEDS_24_WORDS)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import view-only accounts', async () => {
    const smartAccount = SMART_ACC_VIEW_ONLY_ADDRESS
    const basicAccount = BASIC_ACC_VIEW_ONLY_ADDRESS

    await completeOnboardingSteps(page)

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    // Select "Add"
    await clickOnElement(page, SELECTORS.getStartedBtnAdd)

    await typeText(page, buildSelector(TEST_IDS.viewOnlyAddressField, 0), smartAccount)

    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, SELECTORS.viewOnlyBtnImport)

    await clickOnElement(page, SELECTORS.saveAndContinueBtn)

    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    await page.waitForSelector(SELECTORS.address)

    // Verify that added account exist on the page and contains VIEW_ONLY_LABEL
    await checkAccountDetails(page, SELECTORS.account, [smartAccount], [VIEW_ONLY_LABEL])

    await clickOnElement(page, SELECTORS.buttonAddAccount)

    await clickOnElement(page, SELECTORS.watchAddress, true, 1500)
    await typeText(page, buildSelector(TEST_IDS.viewOnlyAddressField, 0), basicAccount)
    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, SELECTORS.viewOnlyBtnImport)
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)
    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    // Verify that added accounts exist on the page and contains VIEW_ONLY_LABEL
    await checkAccountDetails(
      page,
      SELECTORS.account,
      [smartAccount, basicAccount],
      [VIEW_ONLY_LABEL, VIEW_ONLY_LABEL]
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import a couple of view-only accounts (at once) and personalize some of them', async () => {
    const smartAccount = SMART_ACC_VIEW_ONLY_ADDRESS
    const basicAccount = BASIC_ACC_VIEW_ONLY_ADDRESS

    await completeOnboardingSteps(page)

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    // Select "Add"
    await clickOnElement(page, SELECTORS.getStartedBtnAdd)

    // Should not allow importing an invalid address
    // Try to add account with empty string for an address
    await checkTextAreaHasValidInputByGivenText(
      page,
      '',
      buildSelector(TEST_IDS.viewOnlyAddressField, 0),
      SELECTORS.viewOnlyBtnImport,
      INVALID_ADDRESS_OR_UD_DOMAIN_ERROR_MSG
    )

    // Try to add account with invalid address
    await checkTextAreaHasValidInputByGivenText(
      page,
      INVALID_ACC_ADDRESS,
      buildSelector(TEST_IDS.viewOnlyAddressField, 0),
      SELECTORS.viewOnlyBtnImport,
      INVALID_CHECKSUM_ERROR_MSG
    )

    // Type the first address
    await typeText(page, buildSelector(TEST_IDS.viewOnlyAddressField, 0), smartAccount)

    // Click on "add one more address"
    await clickOnElement(page, SELECTORS.addOneMoreAddress)

    // Type the second address
    await typeText(page, buildSelector(TEST_IDS.viewOnlyAddressField, 1), basicAccount)

    // Click on Import button
    await clickOnElement(page, SELECTORS.viewOnlyBtnImport)
    await page.waitForNavigation({ waitUntil: 'load' })

    const isSuccessfullyAddedTwoAccounts = await page.$$eval(
      'div[dir="auto"]',
      (elements, msg) => {
        return elements.some((item) => item.textContent === msg)
      },
      SUCCESSFULLY_ADDED_2_ACCOUNTS_MSG
    )

    expect(isSuccessfullyAddedTwoAccounts).toBe(true)

    // Personalize first account
    await personalizeAccountName(page, TEST_ACCOUNT_NAMES[0], 0)

    // Click Save and continue btn
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)
    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    await checkAccountDetails(
      page,
      SELECTORS.account,
      [smartAccount, basicAccount],
      [VIEW_ONLY_LABEL, VIEW_ONLY_LABEL]
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should create a new hot wallet (Smart Account) by setting up a default seed phrase first, and afterward create a couple of more hot wallets (Smart Accounts) out of the stored seed phrase and personalize some of them', async () => {
    await completeOnboardingSteps(page)

    const isOnboardingStateKeyPresent = await checkStorageKeysExist(
      serviceWorker,
      'onboardingState'
    )
    expect(isOnboardingStateKeyPresent).toBe(true)

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    // Create new hot wallet with seed phrase
    await createHotWalletWithSeedPhrase(page, serviceWorker)

    // Wait for dashboard screen to be loaded
    await page.waitForFunction(() => window.location.href.includes('/dashboard'))
    // Close Pin Ambire extension modal
    await clickOnElement(page, SELECTORS.pinExtensionCloseBtn)

    // Import one new SA from default seed
    await importNewSAFromDefaultSeedAndPersonalizeIt(page, TEST_ACCOUNT_NAMES[0])

    await wait(2000)

    // Wait for dashboard screen to be loaded
    await page.waitForFunction(() => window.location.href.includes('/dashboard'))

    // Import one more new SA from default seed
    await importNewSAFromDefaultSeedAndPersonalizeIt(page, TEST_ACCOUNT_NAMES[1])

    // Get accounts from storage
    const importedAccounts = await serviceWorker.evaluate(() =>
      chrome.storage.local.get('accounts')
    )

    const parsedImportedAccounts = JSON.parse(importedAccounts.accounts)

    // Checks if exact 3 accounts have been added
    expect(parsedImportedAccounts.length).toBe(3)
  })
})
