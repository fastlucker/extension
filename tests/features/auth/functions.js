import { clickOnElement } from '../../common-helpers/clickOnElement'

export async function finishStoriesAndSelectAccount(
  page,
  shouldClickOnAccounts,
  shouldSelectSmartAccount = true
) {
  await page.waitForFunction(() => window.location.href.includes('/account-adder'))

  await clickOnElement(page, 'xpath///a[contains(text(), "Next")]', false, 1500)
  await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]', false, 1500)

  // Select one Legacy and one Smart account and keep the addresses of the accounts
  await page.waitForSelector('[data-testid="checkbox"]')

  // Select one Legacy account and one Smart account
  const firstSelectedBasicAccount = await page.$$eval(
    '[data-testid="add-account"]',
    (element, shouldClick) => {
      if (shouldClick) element[0].click()
      return element[0].textContent
    },
    shouldClickOnAccounts
  )
  const firstSelectedSmartAccount = shouldSelectSmartAccount
    ? await page.$$eval(
        '[data-testid="add-account"]',
        (element, shouldClick) => {
          if (shouldClick) element[1].click()
          return element[1].textContent
        },
        shouldClickOnAccounts
      )
    : null

  await Promise.all([
    // Click on Import Accounts button
    clickOnElement(page, '[data-testid="button-import-account"]:not([disabled])'),
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
    const inputSelector = `[placeholder="Word ${i + 1}"]`
    // eslint-disable-next-line no-await-in-loop
    await page.type(inputSelector, wordToType)
  }
}

export async function expectImportButtonToBeDisabled(page) {
  const isButtonDisabled = await page.$eval('[data-testid="import-button"]', (button) => {
    return button.getAttribute('aria-disabled')
  })

  expect(isButtonDisabled).toBe('true')
}
