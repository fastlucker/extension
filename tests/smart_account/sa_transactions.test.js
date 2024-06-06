import {
  typeText,
  clickOnElement,
  clickElementWithRetry,
  bootstrapWithStorage,
  confirmTransaction,
  selectMaticToken,
  saParams
} from '../functions.js'

const recipientField = '[data-testid="address-ens-field"]'
const amountField = '[data-testid="amount-field"]'

describe('sa_transactions', () => {
  let browser
  let page
  let extensionRootUrl
  let recorder

  beforeEach(async () => {
    const context = await bootstrapWithStorage('sa_transactions', saParams)
    browser = context.browser
    page = context.page
    recorder = context.recorder
    extensionRootUrl = context.extensionRootUrl
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Make valid transaction', async () => {
    /* Click on "Send" button */
    await clickOnElement(page, '[data-testid="dashboard-button-send"]')

    await page.waitForSelector(amountField)

    await selectMaticToken(page)

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
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      '[data-testid="transfer-button-send"]',
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
    )
  })
  //--------------------------------------------------------------------------------------------------------------
  it('Make valid swap ', async () => {
    await page.goto('https://app.uniswap.org/swap?chain=polygon', { waitUntil: 'load' })

    /* Click on 'connect' button */
    await clickOnElement(page, '[data-testid="navbar-connect-wallet"]')

    // await new Promise((r) => setTimeout(r, 2000))
    /* Select 'MetaMask' */
    // await clickOnElement(page, '[data-testid="wallet-option-injected"]')
    await clickElementWithRetry(page, '[data-testid="wallet-option-injected"]')

    // Wait for the new page to be created and click on 'Connect' button
    const newTarget = await browser.waitForTarget(
      (target) => target.url() === `${extensionRootUrl}/action-window.html#/dapp-connect-request`
    )
    const newPage = await newTarget.page()

    newPage.setViewport({
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

    /* Click on 'Confirm Swap' button and confirm transaction */
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      confirmSwapBtn,
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
    )
  })
  //--------------------------------------------------------------------------------------------------------------
  it('Top up gas tank', async () => {
    // Click on Matic (not Gas Tank token)
    await clickOnElement(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-polygon"]'
    )
    // Click on "Top Up Gas Tank"
    await clickOnElement(page, '[data-testid="top-up-button"]')

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/transfer')
      },
      { timeout: 60000 }
    )

    await typeText(page, amountField, '0.0001')

    // Click on "Top Up" button and confirm transaction
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      '[data-testid="transfer-button-send"]',
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send matics greater than the available balance ', async () => {
    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await page.waitForSelector('[data-testid="max-available-ammount"]')

    await selectMaticToken(page)

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
    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await page.waitForSelector('[data-testid="max-available-ammount"]')

    await selectMaticToken(page)

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

  // Jordan: This test consistently functions as expected whenever we run it.
  // Once we've addressed and stabilized the remaining transaction tests, we'll re-enable them.
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

    // Wait for the new page to be created and click on 'Connect' button
    const newTarget = await browser.waitForTarget(
      (target) => target.url() === `${extensionRootUrl}/action-window.html#/dapp-connect-request`
    )
    const newPage = await newTarget.page()
    await clickOnElement(newPage, '[data-testid="dapp-connect-button"]')

    /* Type message in the 'Message' field */
    const textMessage = 'text message'
    await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)
    await new Promise((r) => setTimeout(r, 500))

    /* Click on "Sign" button */
    await clickOnElement(page, 'xpath///span[contains(text(), "Sign")]')

    // Wait for the new window to be created and switch to it
    const newTarget2 = await browser.waitForTarget(
      (target) => target.url() === `${extensionRootUrl}/action-window.html#/sign-message`
    )
    const newPage2 = await newTarget2.page()
    /* Click on "Sign" button */
    await clickOnElement(newPage2, '[data-testid="button-sign"]')
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

    const copiedAddress = process.env.SA_SELECTED_ACCOUNT
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
  it('Pay transaction fee with gas tank', async () => {
    /* Click on "Send" button */
    await clickOnElement(page, '[data-testid="dashboard-button-send"]')

    await page.waitForSelector(amountField)

    await selectMaticToken(page)

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
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      '[data-testid="transfer-button-send"]',
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000maticgastank"]'
    )
  })
  //--------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------
  it.skip('Pay transaction fee with smart account', async () => {
    // Function to update saParams with new values
    function updateSaParams(newValues) {
      saParams.parsedKeystoreSecrets = JSON.parse(newValues.A2_SECRETS)
      saParams.parsedKeystoreKeys = JSON.parse(newValues.A2_KEYS)
      saParams.parsedKeystoreAccounts = JSON.parse(newValues.A2_ACCOUNTS)
    }

    // New values to set in local storage for the test
    const newValues = {
      A2_SECRETS: process.env.A2_SECRETS,
      A2_KEYS: process.env.A2_KEYS,
      A2_ACCOUNTS: process.env.A2_ACCOUNTS
    }

    // Update saParams with the new values
    updateSaParams(newValues)

    // Call bootstrapWithStorage again with the updated saParams
    const context = await bootstrapWithStorage('sa_transactions', saParams)
    browser = context.browser
    page = context.page
    extensionRootUrl = context.extensionRootUrl

    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await selectMaticToken(page)

    /* Type the amount */
    await typeText(page, amountField, '0.0001')

    /* Type the address of the recipient  */
    await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')

    await page.waitForXPath(
      '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
    )
    await page.waitForSelector('[data-testid="checkbox"]')

    /* Check the checkbox "I confirm this address is not a Binance wallet...." */
    await clickOnElement(page, '[data-testid="confirm-address-checkbox"]')

    /* Check the checkbox "Confirm sending to a previously unknown address" */
    await clickOnElement(page, '[data-testid="checkbox"]')

    /* Click on "Send" button and confirm transaction */
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      '[data-testid="transfer-button-send"]',
      '[data-testid="option-0x630fd7f359e483c28d2b0babde1a6f468a1d649e0x0000000000000000000000000000000000000000matic"]'
    )
  })
})
