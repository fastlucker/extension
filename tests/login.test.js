import {
  bootstrap,
  setAmbKeyStoreForLegacy,
  finishStoriesAndSelectAccount,
  clickOnElement,
  typeText
} from './functions.js'

describe('login', () => {
  let browser
  let page
  let extensionRootUrl
  let extensionId

  beforeEach(async () => {
    const context = await bootstrap(page, browser)
    browser = context.browser
    extensionRootUrl = context.extensionRootUrl
    extensionId = context.extensionId

    page = await browser.newPage()

    const getStartedPage = `chrome-extension://${extensionId}/tab.html#/get-started`
    await page.goto(getStartedPage)
    await new Promise((r) => {
      setTimeout(r, 3000)
    })
    await page.bringToFront()
    await page.reload()
  })

  afterEach(async () => {
    await browser.close()
  })

  const enterSeedPhraseField = '[data-testid="enter-seed-phrase-field"]'

  //------------------------------------------------------------------------------------------------------
  it('Create basic account with private key', async () => {
    await setAmbKeyStoreForLegacy(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(
      page,
      '[data-testid="enter-seed-phrase-field"]',
      process.env.PRIVATE_KEY_LEGACY_ACCOUNT
    )

    /* This function will complete the onboarsding stories and will select and retrieve first basic and first smart account */
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page)

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

  //------------------------------------------------------------------------------------------------------
  it('login into basic account with phrase', async () => {
    await setAmbKeyStoreForLegacy(page, '[data-testid="button-proceed-seed-phrase"]')

    const passphraseWords = process.env.PHRASE_LEGACY_ACCOUNT
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
      await finishStoriesAndSelectAccount(page)

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

  //------------------------------------------------------------------------------------------------------
  it('(-) login into legacy account with invalid private key', async () => {
    await setAmbKeyStoreForLegacy(page, '[data-testid="button-import-private-key"]')

    const typeTextAndCheckValidity = async (privateKey, testName) => {
      try {
        await typeText(page, enterSeedPhraseField, privateKey, { delay: 10 })

        /* Check whether text "Invalid private key." exists on the page */
        await page.$$eval('div[dir="auto"]', (element) => {
          return element.find((item) => item.textContent === 'Invalid private key.').textContent
        })
        /* Check whether button is disabled */
        const isButtonDisabled = await page.$eval(
          '[data-testid="phrase-button-import"]',
          (button) => {
            return button.getAttribute('aria-disabled')
          }
        )

        if (isButtonDisabled === 'true') {
          console.log('Button is disabled')
        } else {
          throw new Error('Button is NOT disabled')
        }
      } catch (error) {
        console.error(
          `Error when trying to login with private key: ${privateKey}. Test failed: ${testName}`
        )
        throw error
      }
    }

    /* Test cases with different private keys */
    await typeTextAndCheckValidity(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'Test 1'
    )
    await page.$eval(enterSeedPhraseField, (el) => (el.value = ''))
    console.log(
      'Test 1 passed for privateKey: 0000000000000000000000000000000000000000000000000000000000000000'
    )

    await typeTextAndCheckValidity('', 'Test 2')
    await page.$eval(enterSeedPhraseField, (el) => (el.value = ''))
    console.log('Test 2 passed for privateKey: Empty')

    await typeTextAndCheckValidity(
      '00390ce7b96835258b010e25f9196bf4ddbff575b7c102546e9e40780118018',
      'Test 3'
    )
    await new Promise((r) => setTimeout(r, 1000))
    await page.$eval(enterSeedPhraseField, (el) => (el.value = ''))
    console.log(
      'Test 3 passed for privateKey: 00390ce7b96835258b010e25f9196bf4ddbff575b7c102546e9e40780118018'
    )

    await typeTextAndCheckValidity(
      '03#90ce7b96835258b019e25f9196bf4ddbff575b7c102546e9e40780118018',
      'Test 4'
    )
    console.log(
      'Test 4 passed for privateKey: 03#90ce7b96835258b019e25f9196bf4ddbff575b7c102546e9e40780118018'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Login into basic account with invalid phrase', async () => {
    await setAmbKeyStoreForLegacy(page, '[data-testid="button-proceed-seed-phrase"]')

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
          console.log(`Button is disabled when try to login with phrase ${passphraseWords}`)
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
      console.log(`ERROR MESSAGE: ${validateMessage} EXIST ON THE PAGE.`)
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
  it('change selected account name', async () => {
    await setAmbKeyStoreForLegacy(page, '[data-testid="button-import-private-key"]')

    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(
      page,
      '[data-testid="enter-seed-phrase-field"]',
      process.env.PRIVATE_KEY_LEGACY_ACCOUNT
    )

    /* This function will complete the onboarsding stories and will select and retrieve first basic and first smart account */
    await finishStoriesAndSelectAccount(page)

    const accountName1 = 'Test-Account-1'
    const accountName2 = 'Test-Account-2'

    const editAccountNameFields = await page.$$('[data-testid="pen-icon-edit-name"]')

    await editAccountNameFields[0].click()
    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '[data-testid="edit-name-field-0"]', accountName1)

    await editAccountNameFields[1].click()
    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '[data-testid="edit-name-field-1"]', accountName2)

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
    expect(selectedBasicAccount).toContain(accountName1)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )
    expect(selectedSmartAccount).toContain(accountName2)
  })
  //--------------------------------------------------------------------------------------------------------------
  it('Add View-only account', async () => {
    await setAmbKeyStoreForLegacy(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(
      page,
      '[data-testid="enter-seed-phrase-field"]',
      process.env.PRIVATE_KEY_LEGACY_ACCOUNT
    )

    /* This function will complete the onboarsding stories and will select and retrieve first basic and first smart account */
    await finishStoriesAndSelectAccount(page)

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
    /* Click on "+ Add Account"  */
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-add-account"]')
    await new Promise((r) => setTimeout(r, 500))

    /* Seleck "Watch an address" */
    await clickOnElement(page, '[data-testid="watch-address"]')

    const viewOnlyAddress = '0xC254b41BE9582E45a8Ace62D5ADD3f8092D4ea6c'

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
