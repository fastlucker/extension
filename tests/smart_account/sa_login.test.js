import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import {
  bootstrap,
  setAmbKeyStore,
  finishStoriesAndSelectAccount,
  clickOnElement,
  typeText
} from '../functions.js'

describe('sa_login', () => {
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
    await recorder.start(`./recorder/sa_login_${Date.now()}.mp4`)

    const getStartedPage = `chrome-extension://${extensionId}/tab.html#/get-started`
    await page.goto(getStartedPage)
    await new Promise((r) => {
      setTimeout(r, 3000)
    })
    await page.bringToFront()
    await page.reload()
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //------------------------------------------------------------------------------------------------------
  it('create smart account with phrase', async () => {
    await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

    const passphraseWords = process.env.PASSPHRASE_SA
    const wordArray = passphraseWords.split(' ')

    await page.waitForSelector('[placeholder="Word 1"]')
    for (let i = 0; i < wordArray.length; i++) {
      const wordToType = wordArray[i]

      // Type the word into the input field using page.type
      const inputSelector = `[placeholder="Word ${i + 1}"]`
      await page.type(inputSelector, wordToType)
    }

    /* This function will complete the onboarsding stories and will select and retrieve first basic and first smarts account */
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, true)

    /* Click on "Save and Continue" button */
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/onboarding-completed')
      },
      { timeout: 60000 }
    )

    await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' })

    /* Verify that selected accounts exist on the page */
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

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Login into smart account with invalid phrase', async () => {
    await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

    await page.waitForSelector('[placeholder="Word 1"]')

    /* This function types words in the passphrase fields and checks if the button is disabled. */
    async function typeWordsAndCheckButton(passphraseWords) {
      try {
        const wordArray = passphraseWords.split(' ')

        for (let i = 0; i < wordArray.length; i++) {
          const wordToType = wordArray[i]

          /* Type the word into the input field using page.type */
          const inputSelector = `[placeholder="Word ${i + 1}"]`
          await page.type(inputSelector, wordToType)
        }

        /* Check whether button is disabled */
        const isButtonDisabled = await page.$eval(
          '[data-testid="phrase-button-import"]',
          (button) => {
            return button.getAttribute('aria-disabled')
          }
        )

        if (isButtonDisabled === 'true') {
          // console.log(`Button is disabled when try to login with phrase ${passphraseWords}`)
        } else {
          throw new Error('Button is NOT disabled')
        }
      } catch (error) {
        console.error(`Error when trying to login with phrase: ${passphraseWords}. Test failed`)
        throw error
      }
    }
    /* This function waits until an error message appears on the page.  */
    async function waitUntilError(validateMessage) {
      await page.waitForFunction(
        (text) => {
          const element = document.querySelector('body')
          return element && element.textContent.includes(text)
        },
        { timeout: 8000 },
        validateMessage
      )
      // console.log(`ERROR MESSAGE: ${validateMessage} EXIST ON THE PAGE.`)
    }

    /* Try to login with empty phrase fields */
    let passphraseWords = ''
    await typeWordsAndCheckButton(passphraseWords)

    /* Test cases with different phrases keys */
    passphraseWords =
      '00000 000000 00000 000000 00000 000000 00000 000000 00000 000000 00000 000000'
    await typeWordsAndCheckButton(passphraseWords)

    const errorMessage = 'Invalid Seed Phrase. Please review every field carefully.'
    /* Wait until the error message appears on the page */
    await waitUntilError(errorMessage)

    /* Clear the passphrase fields before write the new phrase */
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
    /* Wait until the error message appears on the page */
    await waitUntilError(errorMessage)
  })
  //--------------------------------------------------------------------------------------------------------------
  it('add view-only smart account', async () => {
    await new Promise((r) => setTimeout(r, 1000))
    const buttonNext = '[data-testid="stories-button-next"]'

    await page.waitForSelector(buttonNext)

    /* Click on "Next" button several times to finish the onboarding */
    await page.$eval(buttonNext, (button) => button.click())

    await page.waitForSelector('[data-testid="stories-button-previous"]')

    await page.$eval(buttonNext, (button) => button.click())
    await page.$eval(buttonNext, (button) => button.click())
    await page.$eval(buttonNext, (button) => button.click())
    await page.$eval(buttonNext, (button) => button.click())

    /* check the checkbox "I agree ..." */
    await page.$eval('[data-testid="checkbox"]', (button) => button.click())
    /* Click on "Got it" */
    await page.$eval(buttonNext, (button) => button.click())

    await page.waitForSelector('[data-testid="get-started-button-add"]')

    /* Select "Add" */
    await clickOnElement(page, '[data-testid="get-started-button-add"]')

    const viewOnlyAddress = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'

    await typeText(page, '[data-testid="view-only-address-field"]', viewOnlyAddress)
    await new Promise((r) => setTimeout(r, 500))

    /* Click on "Import View-Only Accounts" button */
    await clickOnElement(page, '[data-testid="view-only-button-import"]')

    /* Click on "Account"  */
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    await page.goto(`${extensionRootUrl}/tab.html#/account-select`, { waitUntil: 'load' })

    /* Find the element containing the specified address */
    const addressElement = await page.$x(`//*[contains(text(), '${viewOnlyAddress}')]`)

    if (addressElement.length > 0) {
      /* Get the parent element of the element with the specified address */
      const parentElement = await addressElement[0].$x('..')

      if (parentElement.length > 0) {
        /* Get the text content of the parent element and all elements within it */
        const parentTextContent = await page.evaluate((element) => {
          const elements = element.querySelectorAll('*')
          return Array.from(elements, (el) => el.textContent).join('\n')
        }, parentElement[0])

        /* Verify that somewhere in the content there is the text 'View-only' */
        const containsViewOnly = parentTextContent.includes('View-only')

        if (containsViewOnly) {
        } else {
          throw new Error('The content does not contain the text "View-only".')
        }
      }
    }
  })
})
