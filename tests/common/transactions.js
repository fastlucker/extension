import {
  typeText,
  clickOnElement,
  clickElementWithRetry,
  selectMaticToken,
  triggerTransaction,
  checkForSignMessageWindow,
  selectFeeToken,
  signAndConfirmTransaction
} from '../functions'

const recipientField = '[data-testid="address-ens-field"]'
const amountField = '[data-testid="amount-field"]'
//--------------------------------------------------------------------------------------------------------------
export async function makeValidTransaction(page, extensionRootUrl, browser) {
  // Click on "Send" button
  await page.waitForSelector('[data-testid="dashboard-button-send"]')
  await clickOnElement(page, '[data-testid="dashboard-button-send"]')

  await page.waitForSelector('[data-testid="amount-field"]')
  await selectMaticToken(page)
  await typeText(page, '[data-testid="amount-field"]', '0.0001') // Type the amount

  // Type the address of the recipient
  await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
  await page.waitForXPath(
    '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
  )
  await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')

  // Check the checkbox "Confirm sending to a previously unknown address"
  await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')
  await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')

  // Check the checkbox "I confirm this address is not a Binance wallets...."
  const checkboxExists = await page.evaluate(
    () => !!document.querySelector('[data-testid="checkbox"]')
  )
  if (checkboxExists) await clickOnElement(page, '[data-testid="checkbox"]')

  const newPage = await triggerTransaction(
    page,
    browser,
    extensionRootUrl,
    '[data-testid="transfer-button-send"]'
  )

  await new Promise((r) => setTimeout(r, 2000))

  // Check if select fee token is visible and select the token
  await selectFeeToken(
    newPage,
    '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
  )
  await new Promise((r) => setTimeout(r, 1000))
  // Sign and confirm the transaction
  await signAndConfirmTransaction(newPage)
}

//--------------------------------------------------------------------------------------------------------------
export async function makeSwap(page, extensionRootUrl, browser) {
  await page.goto('https://app.uniswap.org/swap?chain=polygon', { waitUntil: 'load' })

  // Click on 'connect' button
  await clickOnElement(page, '[data-testid="navbar-connect-wallet"]')

  // Select option: 'Injected Wallet'
  await clickElementWithRetry(page, '[data-testid="wallet-option-injected"]')

  // Wait for the new page to be created and click on 'Connect' button
  const newTarget = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/action-window.html#/dapp-connect-request`
  )
  const actionWindowPage = await newTarget.page()
  await actionWindowPage.setViewport({ width: 1000, height: 1000 })

  await clickOnElement(actionWindowPage, '[data-testid="dapp-connect-button"]')

  // Select USDT and USDC tokens for swap
  await clickOnElement(page, 'xpath///span[contains(text(), "MATIC")]')

  const USDTSelector = await page.waitForSelector('[data-testid="common-base-USDT"]')
  await USDTSelector.click()

  await page.waitForSelector('[data-testid="common-base-USDT"]', {
    hidden: true,
    timeout: 3000
  })

  // Click on 'Select token' and select 'USDC' token
  await clickOnElement(page, 'xpath///span[contains(text(), "Select token")]')

  await clickOnElement(page, '[data-testid="common-base-USDC"]')
  // wait until element is not displayed
  await page.waitForSelector('[data-testid="common-base-USDC"]', {
    hidden: true,
    timeout: 3000
  })
  await typeText(page, '#swap-currency-output', '0.0001')
  await page.waitForSelector('[data-testid="swap-button"]:not([disabled])')
  await page.click('[data-testid="swap-button"]:not([disabled])')

  // Click on 'Confirm Swap' button and confirm transaction
  await confirmTransaction(
    page,
    extensionRootUrl,
    browser,
    '[data-testid="confirm-swap-button"]:not([disabled]',
    '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
  )
  await new Promise((r) => setTimeout(r, 1000))
  // Sign and confirm the transaction
  await signAndConfirmTransaction(newPage)
}

//--------------------------------------------------------------------------------------------------------------
export async function sendFundsGreaterThatBalance(page, extensionRootUrl) {
  await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

  await page.waitForSelector('[data-testid="max-available-amount"]')

  await selectMaticToken(page)

  // Get the available balance
  const maxAvailableAmount = await page.evaluate(() => {
    const balance = document.querySelector('[data-testid="max-available-amount"]')
    return balance.textContent
  })
  const balance1 = 1 + maxAvailableAmount

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

  await page.waitForSelector('[data-testid="max-available-amount"]')

  await selectMaticToken(page)

  // Type the amount
  await typeText(page, amountField, '0.0001')

  // Type the address of smart contract in the "Add Recipient" field
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
  await context.overridePermissions('https://sigtool.ambire.com', [
    'clipboard-read',
    'clipboard-write'
  ])
  await page.goto('https://sigtool.ambire.com/#dummyTodo', { waitUntil: 'load' })

  // Click on 'connect wallet' button
  const connectButtonSelector = await page.waitForSelector('button[class="button-connect"]')
  connectButtonSelector.click()
  // Select 'MetaMask'
  const connectWalletButtonSelector = await page.waitForSelector('>>>[class^="name"]')
  connectWalletButtonSelector.click()

  // Wait for the new page to be created and click on 'Connect' button
  const newTarget = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/action-window.html#/dapp-connect-request`
  )
  const newPage = await newTarget.page()
  await clickOnElement(newPage, '[data-testid="dapp-connect-button"]')

  // Type message in the 'Message' field
  const textMessage = 'text message'
  await typeText(page, '[placeholder="Message (Hello world)"]', textMessage)

  // Click on "Sign" button
  const signButtonSelector = await page.waitForSelector('xpath///span[contains(text(), "Sign")]')
  signButtonSelector.click()

  // Wait for the new window to be created and switch to it
  const actionWindowTarget = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/action-window.html#/sign-message`
  )
  const actionWindowPage = await actionWindowTarget.page()

  await actionWindowPage.setViewport({ width: 1000, height: 1000 })

  // Click on "Sign" button
  const signActionButtonSelector = await actionWindowPage.waitForSelector(
    '[data-testid="button-sign"]'
  )
  signActionButtonSelector.click()

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

  // Verify that sign message is valid
  // Wait until the 'Signature is Valid' text appears on the page
  await page.waitForFunction(
    (text) => {
      const element = document.querySelector('body')
      return element && element.textContent.includes(text)
    },
    {},
    'Signature is Valid'
  )
}
