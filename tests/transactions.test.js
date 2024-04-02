import { typeText, clickOnElement, setLocalStorage, confirmTransaction } from './functions.js'

const recipientField = '[data-testid="recepient-address-field"]'
const amountField = '[data-testid="amount-field"]'

describe('transactions', () => {
  let browser
  let page
  let extensionRootUrl

  beforeEach(async () => {
    const {
      browser: newBrowser,
      page: newPage,
      extensionRootUrl: newExtensionRootUrl
    } = await setLocalStorage()
    browser = newBrowser
    page = newPage
    extensionRootUrl = newExtensionRootUrl
  })

  afterEach(async () => {
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Make valid transaction', async () => {
    await new Promise((r) => setTimeout(r, 2000))

    await page.waitForSelector('[data-testid="full-balance"]')
    /* Get the available balance */
    const availableAmmount = await page.evaluate(() => {
      const balance = document.querySelector('[data-testid="full-balance"]')
      return balance.innerText
    })

    let availableAmmountNum = availableAmmount.replace(/\n/g, '')
    availableAmmountNum = availableAmmountNum.split('$')[1]
    /* Verify that the balance is bigger than 0 */
    expect(parseFloat(availableAmmountNum) > 0).toBeTruthy()

    /* Click on "Send" button */
    await clickOnElement(page, '[data-testid="dashboard-button-send"]')

    await page.waitForSelector(amountField)

    /* Check if selected network is Polygon */
    const textExists = await page.evaluate(() => {
      return document.body.innerText.includes('MATIC')
    })

    if (!textExists) {
      /* If "MATIC" text does not exist, select network Polygon */
      await clickOnElement(page, 'xpath///div[contains(text(), "on")]')
      await clickOnElement(page, 'xpath///div[contains(text(), "MATIC")]')
    }

    /* Type the amount */
    await typeText(page, amountField, '0.0001')

    /* Type the adress of the recipient  */
    await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
    await page.waitForXPath(
      '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
    )
    await page.waitForSelector('[data-testid="checkbox"]')

    /* Check the checkbox "I confirm this address is not a Binance wallets...." */
    await clickOnElement(page, '[data-testid="confirm-address-checkbox"]')

    /* Check the checkbox "Confirm sending to a previously unknown address" */
    await clickOnElement(page, '[data-testid="checkbox"]')

    /* Click on "Send" button and cofirm transaction */
    await confirmTransaction(page, extensionRootUrl, browser, '[data-testid="padding-button-Send"]')
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send matics greater than the available balance ', async () => {
    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await page.waitForSelector('[data-testid="max-available-ammount"]')
    /* Get the available balance */
    const maxAvailableAmmount = await page.evaluate(() => {
      const balance = document.querySelector('[data-testid="max-available-ammount"]')
      return balance.textContent
    })
    const balance1 = 1 + maxAvailableAmmount

    /* Type the amount bigger than balance */
    await typeText(page, amountField, balance1)

    /* Verify that the message "The amount is greater than the asset's balance:" exist on the page */
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
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send matics to smart contract ', async () => {
    await new Promise((r) => setTimeout(r, 2000))

    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    /* Type the amount */
    await typeText(page, amountField, '0.0001')

    /* Type the adress of smart contract in the "Add Recipient" field */
    await typeText(page, recipientField, '0x4e15361fd6b4bb609fa63c81a2be19d873717870')

    /* Verify that the message "The amount is greater than the asset's balance:" exist on the page */
    const targetText =
      'You are trying to send tokens to a smart contract. Doing so would burn them.'
    // Wait until the specified text appears on the page
    await page.waitForFunction(
      (text) => {
        const element = document.querySelector('body')
        return element && element.textContent.includes(text)
      },
      {},
      targetText
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Send sign message ', async () => {
    /* Allow permissions for read and write in clipboard */
    const context = browser.defaultBrowserContext()
    context.overridePermissions('https://sigtool.ambire.com', ['clipboard-read', 'clipboard-write'])

    await new Promise((r) => setTimeout(r, 2000))
    await page.goto('https://sigtool.ambire.com/#dummyTodo', { waitUntil: 'load' })

    /* Click on 'connect wallet' button */
    await clickOnElement(page, 'button[class="button-connect"]')
    /* Select 'MetaMask' */
    await page.click('>>>[class^="name"]')

    /* Type message in the 'Message' field */
    const textMessage = 'text message'
    await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
    await new Promise((r) => setTimeout(r, 500))
    /* Click on "Sign" button */
    await clickOnElement(page, 'xpath///span[contains(text(), "Sign")]')

    // Wait for the new window to be created and switch to it
    const newTarget = await browser.waitForTarget(
      (target) => target.url() === `${extensionRootUrl}/notification.html#/sign-message`
    )
    const newPage = await newTarget.page()
    /* Click on "Sign" button */
    await clickOnElement(newPage, '[data-testid="padding-button-Sign"]')
    await page.waitForSelector('.signatureResult-signature')
    /* Get the Message signature text */
    const messageSignature = await page.evaluate(() => {
      const message = document.querySelector('.signatureResult-signature')
      return message.textContent
    })

    /* !THIS IS NOT WORKING WITH PUPPETEER. IT CAN'T BE COPIED IN CLIPBOARD. THAT'S WHY copiedAddress
        IS TAKEN FROM selectedAccount OBJECT IN LOCAL STORAGE! */
    /* Click on a button that triggers a copy to clipboard. */
    await page.click('.copyButton')

    const copiedAddress = process.env.KEYSTORE_SELECTED_ACCOUNT_1
    /* Click on "Verify" tab */
    await clickOnElement(page, 'xpath///a[contains(text(), "Verify")]')
    /* Fill copied address in the Signer field */
    await typeText(page, '[placeholder="Signer address (0x....)"]', copiedAddress)
    /* Fill copied address in the Message field */
    await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
    /* Fill copied address in the Hexadecimal signature field */
    await typeText(page, '[placeholder="Hexadecimal signature (0x....)"]', messageSignature)

    /* Click on "Verify" button */
    await clickOnElement(page, '#verifyButton')

    /* Verify that sign message is valid */
    const validateMessage = 'Signature is Valid'
    /* Wait until the 'Signature is Valid' text appears on the page */
    await page.waitForFunction(
      (text) => {
        const element = document.querySelector('body')
        return element && element.textContent.includes(text)
      },
      {},
      validateMessage
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Make valid swap ', async () => {
    await new Promise((r) => setTimeout(r, 2000))
    await page.goto('https://app.uniswap.org/swap', { waitUntil: 'load' })

    /* Click on 'connect' button */
    await clickOnElement(page, '[data-testid="navbar-connect-wallet"]')
    /* Select 'MetaMask' */
    await clickOnElement(page, '[data-testid="wallet-option-EIP_6963_INJECTED"]')
    /* Click on 'Select token' and type 'USDC' and select 'USDC' token */
    await clickOnElement(page, 'xpath///span[contains(text(), "Select token")]')
    // await typeText(page, '[data-testid="token-search-input"]', 'USDC')
    await new Promise((r) => setTimeout(r, 500))
    await clickOnElement(page, '[data-testid="common-base-USDC"]')

    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '#swap-currency-output', '0.0001')

    const selector = '[data-testid="swap-button"]'
    await page.waitForSelector(selector)

    let isClickable = false
    let hasInsufficientBalanceText = false

    // Check every 500ms if the button is clickable for up to 4 seconds
    for (let i = 0; i < 16; i++) {
      isClickable = await page.evaluate((selector) => {
        const element = document.querySelector(selector)
        return element && !element.disabled
      }, selector)

      if (isClickable) break
      await page.waitForTimeout(500) // Wait for 500ms before checking again
    }
    if (isClickable) {
      await page.click(selector)
    } else {
      hasInsufficientBalanceText = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="swap-button"]')
        return element && element.textContent.includes('Insufficient MATIC balance')
      })
      if (hasInsufficientBalanceText) {
        throw new Error('Insufficient MATIC balance')
      }
    }
    /* Click on 'Confirm Swap' button and confirm transaction */
    await confirmTransaction(page, extensionRootUrl, browser, '[data-testid="confirm-swap-button"]')
  })
})
