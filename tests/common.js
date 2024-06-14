import {
  typeText,
  clickOnElement,
  clickElementWithRetry,
  finishStoriesAndSelectAccount,
  setAmbKeyStore,
  confirmTransaction,
  selectMaticToken
} from './functions.js'

const recipientField = '[data-testid="address-ens-field"]'
const amountField = '[data-testid="amount-field"]'

//--------------------------------------------------------------------------------------------------------------
export async function changePassword(page, extensionRootUrl) {
  await page.goto(`${extensionRootUrl}/tab.html#/settings/device-password-change`, {
    waitUntil: 'load'
  })
  const oldPass = process.env.KEYSTORE_PASS
  const newPass = 'B1234566'
  await typeText(page, '[data-testid="enter-current-pass-field"]', oldPass)
  await typeText(page, '[data-testid="enter-new-pass-field"]', newPass)
  await typeText(page, '[data-testid="repeat-new-pass-field"]', newPass)

  await clickOnElement(page, '[data-testid="change-device-pass-button"]')

  // Wait for the modal to appear
  await page.waitForSelector('[data-testid="device-pass-success-modal"]')

  // Click on the element within the modal
  await clickOnElement(page, '[data-testid="device-pass-success-modal"]')
  //! !!FOR THE MOMENT "SIGN OUT" BUTTON DOESN'T EXIST IN THE FULL SCREEN MODE. BELLOW WE VERIFY THAT CHANGED PASSWORD IS ALREADY IN USE.
  // THIS STEP WILL BE CHANGED WHEN THE BUTTON IS CREATED!!!
  await typeText(page, '[data-testid="enter-current-pass-field"]', newPass)
  await typeText(page, '[data-testid="enter-new-pass-field"]', oldPass)
  await typeText(page, '[data-testid="repeat-new-pass-field"]', oldPass)

  await clickOnElement(page, '[data-testid="change-device-pass-button"]')

  // Wait for the modal to appear
  await page.waitForSelector('[data-testid="device-pass-success-modal"]')

  // Click on the element within the modal
  await clickOnElement(page, '[data-testid="device-pass-success-modal"]')

  await new Promise((r) => setTimeout(r, 1000))

  const isModalExist = await page.evaluate(() => {
    // Check if the element "device-pass-success-modal" exists
    return !!document.querySelector('[data-testid="device-pass-success-modal"]')
  })

  expect(isModalExist).toBe(false)
}

//--------------------------------------------------------------------------------------------------------------
export async function addContactInAddressBook(page, extensionRootUrl) {
  await page.goto(`${extensionRootUrl}/tab.html#/settings/address-book`, {
    waitUntil: 'load'
  })

  const addName = 'First Address'
  const addAddress = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'
  // 0xC254b41be9582...          dD3F8092D4ea6C

  await typeText(page, '[data-testid="contact-name-field"]', addName)
  await typeText(page, '[data-testid="address-ens-field"]', addAddress)

  await new Promise((r) => setTimeout(r, 1000))

  await clickOnElement(page, '[data-testid="add-to-address-book-button"]')

  await page.waitForSelector('[data-testid="name-first-address"]')

  const addressContent = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="name-first-address"]')
    return element.outerHTML
  })

  // Ensure the element contains both the name and address
  expect(addressContent).toContain(addName)
  expect(addressContent).toContain(addAddress.substring(addAddress.length - 14))
}

//--------------------------------------------------------------------------------------------------------------
export async function checkBalanceInAccount(page) {
  await page.waitForSelector('[data-testid="full-balance"]')
  await new Promise((r) => setTimeout(r, 1000))

  // Get the available balance
  const availableAmmount = await page.evaluate(() => {
    const balance = document.querySelector('[data-testid="full-balance"]')
    return balance.innerText
  })

  let availableAmmountNum = availableAmmount.replace(/\n/g, '')
  availableAmmountNum = availableAmmountNum.split('$')[1]

  // Verify that the balance is bigger than 0
  expect(parseFloat(availableAmmountNum)).toBeGreaterThan(0)
}

//--------------------------------------------------------------------------------------------------------------
export async function checkNetworks(page) {
  await page.waitForSelector('[data-testid="full-balance"]')

  await new Promise((r) => setTimeout(r, 2000))

  // Verify that USDC, ETH, WALLET
  const text = await page.$eval('*', (el) => el.innerText)

  expect(text).toMatch(/\bUSDC\b/)

  expect(text).toMatch(/\bETH\b/)

  expect(text).toMatch(/\bWALLET\b/)
}

//--------------------------------------------------------------------------------------------------------------
export async function checkCollectibleItem(page) {
  // Click on "Collectibles" button
  await clickOnElement(page, '[data-testid="tab-nft"]')
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 1000))

  const collectionItem = '[data-testid="collection-item"]'
  await page.waitForSelector(collectionItem)

  // Get the text content of the first item
  const firstCollectiblesItem = await page.$$eval(collectionItem, (element) => {
    return element[0].textContent
  })

  const colectiblPicture = '[data-testid="collectible-picture"]'
  // Click on the first item
  await page.waitForSelector(colectiblPicture, { visible: true })
  const element = await page.$(colectiblPicture)
  await element.click()

  // Get the text of the modal and verify that the name of the first collectible item is included
  const modalText = await page.$eval('[data-testid="collectible-row"]', (el) => {
    return el.textContent
  })

  expect(modalText).toContain(firstCollectiblesItem)
}

//--------------------------------------------------------------------------------------------------------------
export async function makeValidTransaction(page, extensionRootUrl, browser) {
  // Click on "Send" button
  await clickOnElement(page, '[data-testid="dashboard-button-send"]')

  await page.waitForSelector(amountField)

  await selectMaticToken(page)

  // Type the amount
  await typeText(page, amountField, '0.0001')

  // Type the adress of the recipient
  await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
  await page.waitForXPath(
    '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
  )
  await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')

  // Check the checkbox "Confirm sending to a previously unknown address"
  await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')

  // Check the checkbox "I confirm this address is not a Binance wallets...."
  const checkboxExists = await page.evaluate(() => {
    return !!document.querySelector('[data-testid="checkbox"]')
  })
  if (checkboxExists) {
    await clickOnElement(page, '[data-testid="checkbox"]')
  }

  // Confirm Transaction
  await confirmTransaction(
    page,
    extensionRootUrl,
    browser,
    '[data-testid="transfer-button-send"]',
    '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
  )
}

//--------------------------------------------------------------------------------------------------------------
export async function makeSwap(page, extensionRootUrl, browser) {
  await page.goto('https://app.uniswap.org/swap?chain=polygon', { waitUntil: 'load' })

  // Click on 'connect' button
  await clickOnElement(page, '[data-testid="navbar-connect-wallet"]')
  // await new Promise((r) => setTimeout(r, 2000))

  // Select 'MetaMask'
  await clickElementWithRetry(page, '[data-testid="wallet-option-injected"]')

  // Wait for the new page to be created and click on 'Connect' button
  const newTarget = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/action-window.html#/dapp-connect-request`
  )
  const newPage = await newTarget.page()

  await newPage.setViewport({
    width: 1000,
    height: 1000
  })

  await clickOnElement(newPage, '[data-testid="dapp-connect-button"]')

  await new Promise((r) => setTimeout(r, 1000))
  // Select USDT and USDC tokens for swap
  await clickOnElement(page, 'xpath///span[contains(text(), "MATIC")]')

  await new Promise((r) => setTimeout(r, 1000))
  await clickOnElement(page, '[data-testid="common-base-USDT"]')

  await page.waitForSelector('[data-testid="common-base-USDT"]', {
    hidden: true,
    timeout: 3000
  })

  // Click on 'Select token' and select 'USDC' token
  await clickOnElement(page, 'xpath///span[contains(text(), "Select token")]')

  // await new Promise((r) => setTimeout(r, 500))
  await clickOnElement(page, '[data-testid="common-base-USDC"]')
  // wait until elemenent is not displayed
  await page.waitForSelector('[data-testid="common-base-USDC"]', {
    hidden: true,
    timeout: 3000
  })
  await typeText(page, '#swap-currency-output', '0.0001')

  const swapBtn = '[data-testid="swap-button"]:not([disabled])'
  await new Promise((r) => setTimeout(r, 500))
  await page.waitForSelector(swapBtn)
  await page.click(swapBtn)
  const confirmSwapBtn = '[data-testid="confirm-swap-button"]:not([disabled]'

  // Click on 'Confirm Swap' button and confirm transaction
  await confirmTransaction(
    page,
    extensionRootUrl,
    browser,
    confirmSwapBtn,
    '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
  )
}

//--------------------------------------------------------------------------------------------------------------
export async function sendFundsGreaterThatBalance(page, extensionRootUrl) {
  await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

  await page.waitForSelector('[data-testid="max-available-ammount"]')

  await selectMaticToken(page)

  // Get the available balance
  const maxAvailableAmmount = await page.evaluate(() => {
    const balance = document.querySelector('[data-testid="max-available-ammount"]')
    return balance.textContent
  })
  const balance1 = 1 + maxAvailableAmmount

  // Type the amount bigger than balance
  await typeText(page, amountField, balance1)

  // Verify that the message "The amount is greater than the asset's balance:" exist on the page
  const targetText = "The amount is greater than the asset's balance:"
  // Wait until the specified text appears on the page
  await page.waitForFunction(
    (text) => {
      const element = document.querySelector('body')
      return element && element.textContent.includes(text)
    },
    {},
    targetText
  )
}

//--------------------------------------------------------------------------------------------------------------
export async function sendFundsToSmartContract(page, extensionRootUrl) {
  await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

  await page.waitForSelector('[data-testid="max-available-ammount"]')

  await selectMaticToken(page)

  // Type the amount
  await typeText(page, amountField, '0.0001')

  // Type the adress of smart contract in the "Add Recipient" field
  await typeText(page, recipientField, '0x4e15361fd6b4bb609fa63c81a2be19d873717870')

  // Verify that the message "The amount is greater than the asset's balance:" exist on the page
  const targetText = 'You are trying to send tokens to a smart contract. Doing so would burn them.'
  // Wait until the specified text appears on the page
  await page.waitForFunction(
    (text) => {
      const element = document.querySelector('body')
      return element && element.textContent.includes(text)
    },
    {},
    targetText
  )
}

//--------------------------------------------------------------------------------------------------------------
export async function signMessage(page, extensionRootUrl, browser, signerAddress) {
  /* Allow permissions for read and write in clipboard */
  const context = browser.defaultBrowserContext()
  context.overridePermissions('https://sigtool.ambire.com', ['clipboard-read', 'clipboard-write'])

  await new Promise((r) => setTimeout(r, 2000))
  await page.goto('https://sigtool.ambire.com/#dummyTodo', { waitUntil: 'load' })

  // Click on 'connect wallet' button
  await clickOnElement(page, 'button[class="button-connect"]')
  // Select 'MetaMask'
  await page.click('>>>[class^="name"]')

  // Wait for the new page to be created and click on 'Connect' button
  const newTarget = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/action-window.html#/dapp-connect-request`
  )
  const newPage = await newTarget.page()
  await clickOnElement(newPage, '[data-testid="dapp-connect-button"]')

  // Type message in the 'Message' field
  const textMessage = 'text message'
  await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
  await new Promise((r) => setTimeout(r, 500))

  // Click on "Sign" button
  await clickOnElement(page, 'xpath///span[contains(text(), "Sign")]')

  // Wait for the new window to be created and switch to it
  const newTarget2 = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/action-window.html#/sign-message`
  )
  const newPage2 = await newTarget2.page()

  await newPage2.setViewport({
    width: 1000,
    height: 1000
  })

  // Click on "Sign" button
  await clickOnElement(newPage2, '[data-testid="button-sign"]')
  await page.waitForSelector('.signatureResult-signature')
  // Get the Message signature text
  const messageSignature = await page.evaluate(() => {
    const message = document.querySelector('.signatureResult-signature')
    return message.textContent
  })

  // !THIS IS NOT WORKING WITH PUPPETEER. IT CAN'T BE COPIED IN CLIPBOARD. THAT'S WHY copiedAddress
  // IS TAKEN FROM selectedAccount OBJECT IN LOCAL STORAGE!
  // Click on a button that triggers a copy to clipboard.
  await page.click('.copyButton')

  // Click on "Verify" tab
  await clickOnElement(page, 'xpath///a[contains(text(), "Verify")]')
  // Fill copied address in the Signer field
  await typeText(page, '[placeholder="Signer address (0x....)"]', signerAddress)
  // Fill copied address in the Message field
  await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
  // Fill copied address in the Hexadecimal signature field
  await typeText(page, '[placeholder="Hexadecimal signature (0x....)"]', messageSignature)

  // Click on "Verify" button
  await clickOnElement(page, '#verifyButton')

  await new Promise((r) => setTimeout(r, 2000))

  // Verify that sign message is valid
  const validateMessage = 'Signature is Valid'
  // Wait until the 'Signature is Valid' text appears on the page
  await page.waitForFunction(
    (text) => {
      const element = document.querySelector('body')
      return element && element.textContent.includes(text)
    },
    {},
    validateMessage
  )
}

//--------------------------------------------------------------------------------------------------------------
export async function createAccountWithPhrase(page, extensionRootUrl, phrase) {
  await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

  const passphraseWords = phrase
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
    await finishStoriesAndSelectAccount(page, 'true')

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
  const selectedBasicAccount = await page.$$eval('[data-testid="account"]', (el) => el[0].innerText)
  expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)

  const selectedSmartAccount = await page.$$eval('[data-testid="account"]', (el) => el[1].innerText)
  expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
}

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
      { timeout: 8000 },
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
    const wordToType = wordArray[i]
    const inputSelector = `[placeholder="Word ${i + 1}"]`
    await page.click(inputSelector, { clickCount: 3 }) // Select all content
    await page.keyboard.press('Backspace') // Delete the selected content
  }

  passphraseWords = 'allow survey play weasel exhibit helmet industry bunker fish step garlic ababa'
  await typeWordsAndCheckButton(passphraseWords)
  // Wait until the error message appears on the page
  await waitUntilError(errorMessage)
}

//--------------------------------------------------------------------------------------------------------------
export async function addViewOnlyAccount(page, extensionRootUrl, viewOnlyAddress) {
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
}
