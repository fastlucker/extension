import { clickOnElement } from '../../common-helpers/clickOnElement'
import { SELECTORS, TEST_IDS } from '../../common/selectors/selectors'
import { buildSelector } from '../../common-helpers/buildSelector'
import { typeText } from '../../common-helpers/typeText'
import { checkStorageKeysExist } from '../../common-helpers/checkStorageKeysExist'
import { setAmbKeyStore } from '../../common-helpers/setAmbKeyStore'
import { URL_ACCOUNT_SELECT, TEST_ACCOUNT_NAMES, INVALID_SEED_PHRASE_ERROR_MSG } from './constants'

export async function checkAccountDetails(
  page,
  selector,
  expectedAccountNames,
  expectedAccountDetails
) {
  const addedAccounts = await page.$$eval(selector, (elements) =>
    elements.map((element) => element.innerText)
  )

  expect(addedAccounts.length).toBe(expectedAccountNames.length)

  expectedAccountNames.forEach((expectedAccount, index) => {
    expect(addedAccounts[index]).toContain(expectedAccount)
    if (expectedAccountDetails && expectedAccountDetails.length && expectedAccountDetails[index]) {
      expect(addedAccounts[index]).toContain(expectedAccountDetails[index])
    }
  })
}

export async function finishStoriesAndSelectAccount(
  page,
  shouldClickOnAccounts,
  shouldSelectSmartAccount = true
) {
  await page.waitForFunction(() => window.location.href.includes('/account-adder'))

  await clickOnElement(page, 'xpath///a[contains(text(), "Next")]', false, 1500)
  await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]', false, 1500)

  // Select one Legacy and one Smart account and keep the addresses of the accounts
  await page.waitForSelector(SELECTORS.checkbox)

  // Select one Legacy account and one Smart account
  const firstSelectedBasicAccount = await page.$$eval(
    SELECTORS.addAccount,
    (element, shouldClick) => {
      if (shouldClick) element[0].click()
      return element[0].textContent
    },
    shouldClickOnAccounts
  )
  const firstSelectedSmartAccount = shouldSelectSmartAccount
    ? await page.$$eval(
        SELECTORS.addAccount,
        (element, shouldClick) => {
          if (shouldClick) element[1].click()
          return element[1].textContent
        },
        shouldClickOnAccounts
      )
    : null

  await Promise.all([
    // Click on Import Accounts button
    clickOnElement(page, `${SELECTORS.buttonImportAccount}:not([disabled])`),
    page.waitForNavigation()
  ])
  const currentUrl = page.url()
  expect(currentUrl).toContain('/account-personalize')
  return { firstSelectedBasicAccount, firstSelectedSmartAccount }
}

export async function typeSeedWords(page, passphraseWords) {
  const wordArray = passphraseWords.split(' ')

  for (let i = 0; i < wordArray.length; i++) {
    const wordToType = wordArray[i]

    // Type the word into the input field using page.type
    const inputSelector = buildSelector(TEST_IDS.seedPhraseInputFieldDynamic, i + 1)
    // eslint-disable-next-line no-await-in-loop
    await page.type(inputSelector, wordToType)
  }
}

async function expectImportButtonToBeDisabled(page) {
  const isButtonDisabled = await page.$eval(SELECTORS.importBtn, (button) => {
    return button.getAttribute('aria-disabled')
  })

  expect(isButtonDisabled).toBe('true')
}

export async function clearSeedWordsInputs(page, passphraseWords) {
  for (let i = 0; i < passphraseWords.split(' ').length; i++) {
    // Type the word into the input field using page.type
    const inputSelector = buildSelector(TEST_IDS.seedPhraseInputFieldDynamic, i + 1)
    // eslint-disable-next-line no-await-in-loop
    await page.click(inputSelector, { clickCount: 3 }) // Select all content
    // eslint-disable-next-line no-await-in-loop
    await page.keyboard.press('Backspace') // Delete the selected content
  }
}

// This function waits until an error message appears on the page.
export async function waitUntilError(page, validateMessage) {
  await page.waitForFunction(
    (text) => {
      const element = document.querySelector('body')
      return element && element.textContent.includes(text)
    },
    { timeout: 60000 },
    validateMessage
  )
}

export async function typeSeedAndExpectImportButtonToBeDisabled(page, seedWords) {
  await typeSeedWords(page, seedWords)
  await expectImportButtonToBeDisabled(page)
}

export function buildSelectorsForDynamicTestId(testId, arrayOfIndexes) {
  return arrayOfIndexes.map((_, index) => buildSelector(testId, index))
}

/* eslint-disable no-promise-executor-return */
export async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function checkTextAreaHasValidInputByGivenText(
  page,
  privateKey,
  selectorInputField,
  selectorImportButton,
  errorMsg
) {
  await typeText(page, selectorInputField, privateKey, { delay: 10 })
  await wait(1000)
  if (privateKey !== '') {
    // Check whether text "errorMsg" exists on the page
    const isDivContainsInvalidPrivKey = await page.$$eval(
      'div[dir="auto"]',
      (elements, errMsg) => {
        return elements.some((item) => item.textContent === errMsg)
      },
      errorMsg
    )

    expect(isDivContainsInvalidPrivKey).toBe(true)
  }

  // Check whether button is disabled
  const isButtonDisabled = await page.$eval(selectorImportButton, (button) => {
    return button.getAttribute('aria-disabled')
  })

  expect(isButtonDisabled).toBe('true')

  // Clear the TextArea
  await page.click(selectorInputField, { clickCount: 3 })
  await page.keyboard.press('Backspace')
}

export async function getInputValuesFromFields(_page) {
  const inputSelectors = Array.from({ length: 12 }, (_, i) =>
    buildSelector(TEST_IDS.recoveryWithSeedWordDyn, i)
  )
  const inputValues = await Promise.all(
    inputSelectors.map(async (selector) => {
      await _page.waitForSelector(selector)
      const value = await _page.$eval(selector, (input) => input.value)
      return value
    })
  )
  return inputValues
}

export async function personalizeAccountName(page, newName, accIndex = 0) {
  await clickOnElement(page, buildSelector(TEST_IDS.editBtnForEditNameField, accIndex))
  await typeText(page, buildSelector(TEST_IDS.editFieldNameField, accIndex), newName)
  await clickOnElement(page, buildSelector(TEST_IDS.editBtnForEditNameField, accIndex))
}

export async function importNewSAFromDefaultSeedAndPersonalizeIt(page, newName) {
  // Click on account select button
  await clickOnElement(page, SELECTORS.accountSelectBtn)
  // Wait for dashboard screen to be loaded
  await page.waitForFunction(() => window.location.href.includes('/account-select'))
  // Click on "Add Account"
  await clickOnElement(page, SELECTORS.buttonAddAccount)

  await wait(500)
  // Wait until "Import a new Smart Account from the default Seed Phrase" button loaded
  await page.waitForSelector(SELECTORS.createNewWallet, { visible: true })
  // Click on "Import a new Smart Account from the default Seed Phrase" button
  await clickOnElement(page, SELECTORS.createNewWallet)
  // TODO: create a couple of more hot wallets (Smart Accounts) out of the stored seed phrase and personalize some of them

  await page.waitForNavigation({ waitUntil: 'load' })
  // TODO: maybe this check is redundant
  const isSuccAddedOneAcc = await page.$$eval(
    'div[dir="auto"]',
    (elements, msg) => {
      return elements.some((item) => item.textContent === msg)
    },
    'Successfully added 1 account'
  )
  expect(isSuccAddedOneAcc).toBe(true)

  const addedNewAccCount = await page.$$eval(
    SELECTORS.personalizeAccount,
    (elements) => elements.length
  )
  expect(addedNewAccCount).toBe(1)

  // Personalize the account
  await personalizeAccountName(page, newName)

  // Click "Save and continue button"
  await clickOnElement(page, SELECTORS.saveAndContinueBtn)
}

export async function createHotWalletWithSeedPhrase(page, serviceWorker) {
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
  const positionsOfSeedWords = await page.$$eval(SELECTORS.seedWordNumberToBeEntered, (elements) =>
    elements.map((element) => Number(element.innerText.replace('#', '')))
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
}

async function testWithInvalidSeedPhrase(page, invalidSeeds) {
  // Try to login with empty phrase fields
  await typeSeedAndExpectImportButtonToBeDisabled(page, '')

  expect(invalidSeeds.length).toBe(2)

  const [firstInvalidSeed, secondInvalidSeed] = invalidSeeds

  // Type seed words from the first incorrect seed
  await typeSeedAndExpectImportButtonToBeDisabled(page, firstInvalidSeed)
  // Wait until the error message appears on the page
  await waitUntilError(page, INVALID_SEED_PHRASE_ERROR_MSG)

  // Clear the passphrase fields before write the new phrase
  await clearSeedWordsInputs(page, firstInvalidSeed)

  // Type seed words from the second incorrect seed
  await typeSeedAndExpectImportButtonToBeDisabled(page, secondInvalidSeed)
  // Wait until the error message appears on the page
  await waitUntilError(page, INVALID_SEED_PHRASE_ERROR_MSG)

  // Clear the passphrase fields before write the new phrase
  await clearSeedWordsInputs(page, secondInvalidSeed)
}

export async function importAccountsFromSeedPhrase(page, extensionURL, seed, invalidSeeds) {
  await setAmbKeyStore(page, SELECTORS.buttonProceedSeedPhrase)

  const firstSeedInputField = buildSelector(TEST_IDS.seedPhraseInputFieldDynamic, 1)
  await page.waitForSelector(firstSeedInputField)

  if (seed.split(' ').length === 24) {
    // Click on dropdown and select a "24 words seed phrase"
    await clickOnElement(page, SELECTORS.selectSeedPhraseLength)

    await clickOnElement(page, SELECTORS.option24WordsSeedPhrase)
  }

  await testWithInvalidSeedPhrase(page, invalidSeeds)

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

  await checkAccountDetails(
    page,
    SELECTORS.account,
    [accountName1, accountName2],
    [firstSelectedBasicAccount, firstSelectedSmartAccount]
  )
}
