import { setAmbKeyStore } from '../common-helpers/setAmbKeyStore'

//--------------------------------------------------------------------------------------------------------------
export async function createAccountWithInvalidPhrase(page) {
  await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

  await page.waitForSelector('[placeholder="Word 1"]')

  // This function types words in the passphrase fields and checks if the button is disabled.
  async function typeWordsAndCheckButton(passphraseWords) {
    const wordArray = passphraseWords.split(' ')

    for (let i = 0; i < wordArray.length; i++) {
      const wordToType = wordArray[i]

      // Type the word into the input field using page.type
      const inputSelector = `[placeholder="Word ${i + 1}"]`
      await page.type(inputSelector, wordToType)
    }

    // Check whether button is disabled
    const isButtonDisabled = await page.$eval('[data-testid="import-button"]', (button) => {
      return button.getAttribute('aria-disabled')
    })

    expect(isButtonDisabled).toBe('true')
  }

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
  await typeWordsAndCheckButton(passphraseWords)

  // Test cases with different phrases keys
  passphraseWords = '00000 000000 00000 000000 00000 000000 00000 000000 00000 000000 00000 000000'
  await typeWordsAndCheckButton(passphraseWords)

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

  passphraseWords = 'allow survey play weasel exhibit helmet industry bunker fish step garlic ababa'
  await typeWordsAndCheckButton(passphraseWords)
  // Wait until the error message appears on the page
  await waitUntilError(errorMessage)
}
