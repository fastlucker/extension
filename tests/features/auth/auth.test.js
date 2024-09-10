import { completeOnboardingSteps } from '../../common-helpers/completeOnboardingSteps'
import {
  URL_GET_STARTED,
  URL_ACCOUNT_SELECT,
  INVITE_STORAGE_ITEM,
  INVITE_STATUS_VERIFIED,
  TEST_ACCOUNT_NAMES,
  TEST_ID_ENTER_SEED_PHRASE_FIELD_PLACEHOLDER,
  INVALID_SEEDS,
  INVALID_SEED_PHRASE_ERROR_MSG,
  ARRAY_TWO_INDEXES,
  SMART_ACC_VIEW_ONLY_ADDRESS,
  BASIC_ACC_VIEW_ONLY_ADDRESS,
  VIEW_ONLY_LABEL,
  INVALID_PRIV_KEYS,
  INVALID_PRIVATE_KEY_ERROR_MSG
} from './constants'
import { bootstrap } from '../../common-helpers/bootstrap'
import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
import {
  finishStoriesAndSelectAccount,
  typeSeedWords,
  clearSeedWordsInputs,
  waitUntilError,
  typeSeedAndExpectImportButtonToBeDisabled,
  buildSelectorsForDynamicTestId,
  wait,
  checkTextAreaHasValidInputByGivenText
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
    await browser.close()
  })

  // TODO: Remove all skips from the tests

  //--------------------------------------------------------------------------------------------------------------
  it('should import basic account from private key', async () => {
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
    await wait(2000)

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(SELECTORS.account, (el) => el[0].innerText)
    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import one Basic Account and one Smart Account from a seed phrase and personalize them', async () => {
    await setAmbKeyStore(page, SELECTORS.buttonProceedSeedPhrase)

    const firstSeedInputField = buildSelector(TEST_IDS.seedPhraseInputFieldDynamic, 1)
    await page.waitForSelector(firstSeedInputField)

    await typeSeedWords(page, seed)

    // Click on Import button.
    await clickOnElement(page, SELECTORS.importBtn)

    // so that the modal appears
    await wait(500)

    await clickOnElement(page, SELECTORS.doNotSaveSeedBtn)

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, true)

    const [accountName1, accountName2] = TEST_ACCOUNT_NAMES
    const [btnProceedSeedPhraseWithIndexZeroSelector, btnProceedSeedPhraseWithIndexOneSelector] =
      buildSelectorsForDynamicTestId(TEST_IDS.editBtnForEditNameField, ARRAY_TWO_INDEXES)
    const [editFieldNameFieldWithIndexZeroSelector, editFieldNameFieldWithIndexOneSelector] =
      buildSelectorsForDynamicTestId(TEST_IDS.editFieldNameField, ARRAY_TWO_INDEXES)

    await clickOnElement(page, btnProceedSeedPhraseWithIndexZeroSelector)
    await typeText(page, editFieldNameFieldWithIndexZeroSelector, accountName1)

    await clickOnElement(page, btnProceedSeedPhraseWithIndexOneSelector)
    await typeText(page, editFieldNameFieldWithIndexOneSelector, accountName2)

    // Click on the checkmark icon to save the new account names
    await clickOnElement(page, btnProceedSeedPhraseWithIndexZeroSelector)
    await clickOnElement(page, btnProceedSeedPhraseWithIndexOneSelector)

    await wait(1000)

    // Click on "Save and Continue" button
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
  it('should import view-only accounts', async () => {
    const smartAccount = SMART_ACC_VIEW_ONLY_ADDRESS
    const basicAccount = BASIC_ACC_VIEW_ONLY_ADDRESS

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
    // Verify that added accounts exist on the page and contains VIEW_ONLY_LABEL
    let selectedBasicAccount = await page.$eval(SELECTORS.account, (el) => el.innerText)

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain(VIEW_ONLY_LABEL)

    await clickOnElement(page, SELECTORS.buttonAddAccount)

    await clickOnElement(page, SELECTORS.watchAddress, true, 1500)
    await typeText(page, SELECTORS.addressEnsField, basicAccount)
    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, SELECTORS.viewOnlyBtnImport)
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)
    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    // Verify that added accounts exist on the page and contains VIEW_ONLY_LABEL
    selectedBasicAccount = await page.$$eval(SELECTORS.account, (el) => el[0].innerText)

    const selectedSmartAccount = await page.$$eval(SELECTORS.account, (el) => el[1].innerText)

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain(VIEW_ONLY_LABEL)
    expect(selectedSmartAccount).toContain(basicAccount)
    expect(selectedSmartAccount).toContain(VIEW_ONLY_LABEL)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should not allow importing an invalid seed phrase', async () => {
    await setAmbKeyStore(page, SELECTORS.buttonProceedSeedPhrase)

    const firstSeedInputField = buildSelector(TEST_IDS.seedPhraseInputFieldDynamic, 1)
    await page.waitForSelector(firstSeedInputField)

    // Try to login with empty phrase fields
    await typeSeedAndExpectImportButtonToBeDisabled(page, '')

    expect(INVALID_SEEDS.length).toBe(2)

    // Type seed words from the first incorrect seed
    await typeSeedAndExpectImportButtonToBeDisabled(page, INVALID_SEEDS[0])
    // Wait until the error message appears on the page
    await waitUntilError(page, INVALID_SEED_PHRASE_ERROR_MSG)

    // Clear the passphrase fields before write the new phrase
    await clearSeedWordsInputs(page, INVALID_SEEDS[0])

    // Type seed words from the second incorrect seed
    await typeSeedAndExpectImportButtonToBeDisabled(page, INVALID_SEEDS[1])
    // Wait until the error message appears on the page
    await waitUntilError(page, INVALID_SEED_PHRASE_ERROR_MSG)
  })
  //------------------------------------------------------------------------------------------------------
  it('should not allow importing an invalid private key', async () => {
    await setAmbKeyStore(page, SELECTORS.importPrivateBtn)

    // eslint-disable-next-line no-restricted-syntax
    for (const privKey of INVALID_PRIV_KEYS) {
      // eslint-disable-next-line no-await-in-loop
      await checkTextAreaHasValidInputByGivenText(
        page,
        privKey,
        SELECTORS.enterSeedPhraseField,
        INVALID_PRIVATE_KEY_ERROR_MSG
      )
    }
  })
})
