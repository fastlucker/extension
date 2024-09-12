import { clickOnElement } from '../../common-helpers/clickOnElement'
import { SELECTORS, TEST_IDS } from '../../common/selectors/selectors'
import { buildSelector } from '../../common-helpers/buildSelector'
import { typeText } from '../../common-helpers/typeText'

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

export async function importNewSAFromDefaultSeed(page) {
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

  // Click "Save and continue button"
  await clickOnElement(page, SELECTORS.saveAndContinueBtn)
}
