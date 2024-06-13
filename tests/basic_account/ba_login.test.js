import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import {
  bootstrap,
  setAmbKeyStore,
  finishStoriesAndSelectAccount,
  clickOnElement,
  typeText,
  INVITE_STORAGE_ITEM
} from '../functions.js'

describe('ba_login', () => {
  let browser
  let page
  let extensionRootUrl
  let extensionId
  let recorder

  beforeEach(async () => {
    const context = await bootstrap()
    browser = context.browser
    extensionRootUrl = context.extensionRootUrl
    extensionId = context.extensionId

    page = await browser.newPage()

    recorder = new PuppeteerScreenRecorder(page)
    await recorder.start(`./recorder/ba_login_${Date.now()}.mp4`)

    const getStartedPage = `chrome-extension://${extensionId}/tab.html#/get-started`
    await page.goto(getStartedPage)

    // Bypass the invite verification step
    await page.evaluate((invite) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      chrome.storage.local.set({ invite })
    }, JSON.stringify(INVITE_STORAGE_ITEM))

    await new Promise((r) => {
      setTimeout(r, 3000)
    })
    await page.bringToFront()
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  const enterSeedPhraseField = '[data-testid="enter-seed-phrase-field"]'

  //------------------------------------------------------------------------------------------------------
  it('create basic and smart accounts with private key', async () => {
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.BA_PRIVATE_KEY)

    // This function will complete the onboarsding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page)

    // Click on "Save and Continue" button
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/onboarding-completed')
      },
      { timeout: 60000 }
    )

    await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )
    expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
  })

  //------------------------------------------------------------------------------------------------------
  it('create basic account with phrase', async () => {
    await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

    const passphraseWords = process.env.BA_PASSPHRASE
    const wordArray = passphraseWords.split(' ')

    await page.waitForSelector('[placeholder="Word 1"]')
    for (let i = 0; i < wordArray.length; i++) {
      const wordToType = wordArray[i]

      // Type the word into the input field using page.type
      const inputSelector = `[placeholder="Word ${i + 1}"]`
      await page.type(inputSelector, wordToType)
    }

    // This function will complete the onboarsding stories and will select and retrieve first basic and first smarts account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, true)

    // Click on "Save and Continue" button
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/onboarding-completed')
      },
      { timeout: 60000 }
    )

    await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )
    expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
  })

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
        { timeout: 8000 },
        validateMessage
      )
    }

    // Try to login with empty phrase fields
    let passphraseWords = ''
    await typeWordsAndCheckButton(passphraseWords)

    // Test cases with different phrases keys
    passphraseWords =
      '00000 000000 00000 000000 00000 000000 00000 000000 00000 000000 00000 000000'
    await typeWordsAndCheckButton(passphraseWords)

    const errorMessage = 'Invalid Seed Phrase. Please review every field carefully.'
    // Wait until the error message appears on the page
    await waitUntilError(errorMessage)

    // Clear the passphrase fields before write the new phrase
    const wordArray = passphraseWords.split(' ')
    for (let i = 0; i < wordArray.length; i++) {
      const wordToType = wordArray[i]
      const inputSelector = `[placeholder="Word ${i + 1}"]`
      await page.click(inputSelector, { clickCount: 3 }) // Select all content
      await page.keyboard.press('Backspace') // Delete the selected content
    }

    passphraseWords =
      'allow survey play weasel exhibit helmet industry bunker fish step garlic ababa'
    await typeWordsAndCheckButton(passphraseWords)
    // Wait until the error message appears on the page
    await waitUntilError(errorMessage)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('change the name of the selected BA & SA account', async () => {
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')

    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.BA_PRIVATE_KEY)

    // This function will complete the onboarsding stories and will select and retrieve first basic and first smart account
    await finishStoriesAndSelectAccount(page)

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

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/onboarding-completed')
      },
      { timeout: 60000 }
    )

    await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(accountName1)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )
    expect(selectedSmartAccount).toContain(accountName2)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('add view-only basic account', async () => {
    await new Promise((r) => setTimeout(r, 1000))
    const buttonNext = '[data-testid="stories-button-next"]'

    await page.waitForSelector(buttonNext)

    // Click on "Next" button several times to finish the onboarding
    await page.$eval(buttonNext, (button) => button.click())

    await page.waitForSelector('[data-testid="stories-button-previous"]')

    await page.$eval(buttonNext, (button) => button.click())
    await page.$eval(buttonNext, (button) => button.click())
    await page.$eval(buttonNext, (button) => button.click())
    await page.$eval(buttonNext, (button) => button.click())

    // check the checkbox "I agree ..."
    await page.$eval('[data-testid="checkbox"]', (button) => button.click())
    // Click on "Got it"
    await page.$eval(buttonNext, (button) => button.click())

    await page.waitForSelector('[data-testid="get-started-button-add"]')

    // Select "Add"
    await clickOnElement(page, '[data-testid="get-started-button-add"]')

    const viewOnlyAddress = '0x048d8573402CE085A6c8f34d568eC2Ccc995196e'

    await typeText(page, '[data-testid="address-ens-field"]', viewOnlyAddress)
    await new Promise((r) => setTimeout(r, 500))

    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, '[data-testid="view-only-button-import"]')

    // Click on "Account"
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' })

    // Find the element containing the specified address
    const addressElement = await page.$x(`//*[contains(text(), '${viewOnlyAddress}')]`)

    if (addressElement.length > 0) {
      // Get the parent element of the element with the specified address
      const parentElement = await addressElement[0].$x('..')

      if (parentElement.length > 0) {
        // Get the text content of the parent element and all elements within it
        const parentTextContent = await page.evaluate((element) => {
          const elements = element.querySelectorAll('*')
          return Array.from(elements, (el) => el.textContent).join('\n')
        }, parentElement[0])

        // Verify that somewhere in the content there is the text 'View-only'
        const containsViewOnly = parentTextContent.includes('View-only')

        if (containsViewOnly) {
        } else {
          throw new Error('The content does not contain the text "View-only".')
        }
      }
    }
  })
})
