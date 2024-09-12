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
  typeSeedWords,
  clearSeedWordsInputs,
  waitUntilError,
  typeSeedAndExpectImportButtonToBeDisabled,
  buildSelectorsForDynamicTestId,
  wait,
  checkTextAreaHasValidInputByGivenText,
  getInputValuesFromFields,
  importNewSAFromDefaultSeed
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

  //--------------------------------------------------------------------------------------------------------------
  it.skip('should import basic account from private key', async () => {
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
  it.skip('should import one Basic Account and one Smart Account from a seed phrase and personalize them', async () => {
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
      buildSelectorsForDynamicTestId(TEST_IDS.editBtnForEditNameField, TEST_ACCOUNT_NAMES)
    const [editFieldNameFieldWithIndexZeroSelector, editFieldNameFieldWithIndexOneSelector] =
      buildSelectorsForDynamicTestId(TEST_IDS.editFieldNameField, TEST_ACCOUNT_NAMES)

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
  it.skip('should import view-only accounts', async () => {
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
    // Verify that added accounts exist on the page and contains VIEW_ONLY_LABEL
    let selectedBasicAccount = await page.$eval(SELECTORS.account, (el) => el.innerText)

    expect(selectedBasicAccount).toContain(smartAccount)
    expect(selectedBasicAccount).toContain(VIEW_ONLY_LABEL)

    await clickOnElement(page, SELECTORS.buttonAddAccount)

    await clickOnElement(page, SELECTORS.watchAddress, true, 1500)
    await typeText(page, buildSelector(TEST_IDS.viewOnlyAddressField, 0), basicAccount)
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
  it.skip('should import a couple of view-only accounts (at once) and personalize some of them', async () => {
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
    await clickOnElement(page, buildSelector(TEST_IDS.editBtnForEditNameField, 0))
    await typeText(page, buildSelector(TEST_IDS.editFieldNameField, 0), TEST_ACCOUNT_NAMES[0])
    await clickOnElement(page, buildSelector(TEST_IDS.editBtnForEditNameField, 0))

    // Click Save and continue btn
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)
    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    const addedAccounts = await page.$$eval(SELECTORS.account, (elements) =>
      elements.map((element) => element.innerText)
    )
    expect(addedAccounts.length).toBe(2)

    const [firstAccount, secondAccount] = addedAccounts

    expect(firstAccount).toContain(smartAccount)
    expect(firstAccount).toContain(VIEW_ONLY_LABEL)
    expect(secondAccount).toContain(basicAccount)
    expect(secondAccount).toContain(VIEW_ONLY_LABEL)
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('should not allow importing an invalid seed phrase', async () => {
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
  it.skip('should not allow importing an invalid private key', async () => {
    await setAmbKeyStore(page, SELECTORS.importPrivateBtn)

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
  })

  it('should create a new hot wallet (Smart Account) by setting up a default seed phrase first, and afterward create a couple of more hot wallets (Smart Accounts) out of the stored seed phrase and personalize some of them', async () => {
    await completeOnboardingSteps(page)

    const isOnboardingStateKeyPresent = await checkStorageKeysExist(
      serviceWorker,
      'onboardingState'
    )
    expect(isOnboardingStateKeyPresent).toBe(true)

    await page.waitForFunction(() => window.location.href.includes('/get-started'))
    // Click on "Create a new hot wallet" button
    await clickOnElement(page, SELECTORS.getStartedCreateHotWallet)
    await page.waitForSelector(SELECTORS.setUpWithSeedPhraseBtn)
    // Click on "Set up with a seed phrase" button
    await clickOnElement(page, SELECTORS.setUpWithSeedPhraseBtn)
    // Wait for keystore to be loaded
    await page.waitForFunction(() => window.location.href.includes('/keystore-setup'))
    // type Device password
    const phrase = 'Password'
    await typeText(page, SELECTORS.enterPassField, phrase)
    await typeText(page, SELECTORS.repeatPassField, phrase)
    // Click on "Set up Ambire Key Store" button
    await clickOnElement(page, SELECTORS.keystoreBtnCreate)
    await clickOnElement(page, SELECTORS.keystoreBtnContinue, true, 1500)

    const isKeyStoreUidKeyPresent = await checkStorageKeysExist(serviceWorker, 'keyStoreUid')
    expect(isKeyStoreUidKeyPresent).toBe(true)

    // Wait until create seed phrase loaded
    await page.waitForFunction(() => window.location.href.includes('/create-seed-phrase/prepare'))
    // Check all the checkboxes
    await clickOnElement(page, buildSelector(TEST_IDS.createSeedPrepareCheckboxDyn, 0))
    await clickOnElement(page, buildSelector(TEST_IDS.createSeedPrepareCheckboxDyn, 1))
    await clickOnElement(page, buildSelector(TEST_IDS.createSeedPrepareCheckboxDyn, 2))
    // Wait until the "Review seed phrase" button to be enabled
    await page.waitForSelector(`${SELECTORS.reviewSeedPhraseBtn}:not([disabled])`, {
      visible: true
    })
    // Click on "Review seed phrase" button
    await clickOnElement(page, SELECTORS.reviewSeedPhraseBtn)
    await page.waitForFunction(() => window.location.href.includes('/create-seed-phrase/write'))

    // Get seed values from all the input fields
    const storedSeed = await getInputValuesFromFields(page)
    expect(storedSeed.length).toBe(12)
    // Click on "Continue" button
    await clickOnElement(page, SELECTORS.createSeedPhraseWriteContinueBtn)
    await page.waitForFunction(() => window.location.href.includes('/create-seed-phrase/confirm'))

    // Get the positions of the seed words
    const positionsOfSeedWords = await page.$$eval(
      SELECTORS.seedWordNumberToBeEntered,
      (elements) => elements.map((element) => Number(element.innerText.replace('#', '')))
    )

    expect(positionsOfSeedWords.length).toBe(4)
    // Write exact seed word on exact position
    // eslint-disable-next-line no-restricted-syntax
    for (const position of positionsOfSeedWords) {
      // eslint-disable-next-line no-await-in-loop
      const inputSelector = buildSelector(TEST_IDS.seedWordPositionFieldDyn, position)
      // eslint-disable-next-line no-await-in-loop
      await page.type(inputSelector, storedSeed[position - 1])
    }
    // Wait Continue btn to be enabled then click on it
    await page.waitForSelector(`${SELECTORS.createSeedPhraseConfirmContinueBtn}:not([disabled])`, {
      visible: true
    })
    await clickOnElement(page, SELECTORS.createSeedPhraseConfirmContinueBtn)
    await page.waitForNavigation({ waitUntil: 'load' })
    // TODO: maybe this check is redundant
    const isSuccessfullyAddedOneAccount = await page.$$eval(
      'div[dir="auto"]',
      (elements, msg) => {
        return elements.some((item) => item.textContent === msg)
      },
      'Successfully added 1 account'
    )
    expect(isSuccessfullyAddedOneAccount).toBe(true)

    const addedAccountsCount = await page.$$eval(
      SELECTORS.personalizeAccount,
      (elements) => elements.length
    )
    expect(addedAccountsCount).toBe(1)

    const areKeysPresent = await checkStorageKeysExist(serviceWorker, [
      'selectedAccount',
      'accounts',
      'keystoreSeeds'
    ])
    expect(areKeysPresent).toBe(true)

    // Click "Save and continue button"
    await clickOnElement(page, SELECTORS.saveAndContinueBtn)

    // Wait for dashboard screen to be loaded
    await page.waitForFunction(() => window.location.href.includes('/dashboard'))
    // Close Pin Ambire extension modal
    await clickOnElement(page, SELECTORS.pinExtensionCloseBtn)

    // Import one new SA from default seed
    await importNewSAFromDefaultSeed(page)

    await wait(2000)

    // Wait for dashboard screen to be loaded
    await page.waitForFunction(() => window.location.href.includes('/dashboard'))

    // Import one more new SA from default seed
    await importNewSAFromDefaultSeed(page)

    // Get accounts from storage
    const importedAccounts = await serviceWorker.evaluate(() =>
      chrome.storage.local.get('accounts')
    )

    const parsedImportedAccounts = JSON.parse(importedAccounts.accounts)

    // Check if exact 3 accounts have been added
    expect(parsedImportedAccounts.length).toBe(3)
  })
})
