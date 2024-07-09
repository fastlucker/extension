import {
  typeText,
  clickOnElement,
  bootstrapWithStorage,
  saParams,
  selectMaticToken,
  triggerTransaction,
  checkForSignMessageWindow,
  signTransaction,
  confirmTransactionStatus,
  selectFeeToken
} from '../functions'

const recipientField = '[data-testid="address-ens-field"]'
const amountField = '[data-testid="amount-field"]'

let browser

let page
let extensionRootUrl
let recorder

describe('sa_features', () => {
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
  it.skip('Top up gas tank', async () => {
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
    await signTransaction(newPage)
    await confirmTransactionStatus(newPage, 'polygon', 137)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Pay transaction fee with gas tank', async () => {
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
    await page.waitForSelector('[data-testid="checkbox"]')
    await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')

    // Check the checkbox "I confirm this address is not a Binance wallets...."
    await clickOnElement(page, '[data-testid="checkbox"]')

    // Check the checkbox "Confirm sending to a previously unknown address"
    await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')

    // Click on "Send" button and cofirm transaction
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
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000maticgastank"]'
    )
    await new Promise((r) => setTimeout(r, 1000))
    // Sign and confirm the transaction
    await signTransaction(newPage)
    await confirmTransactionStatus(newPage, 'polygon', 137)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Pay transaction fee with basic account', async () => {
    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await page.waitForSelector(amountField)

    await selectMaticToken(page)

    // Type the amount
    await typeText(page, amountField, '0.0001')

    // Type the adress of the recipient
    await typeText(page, recipientField, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C')
    await page.waitForXPath(
      '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
    )
    await page.waitForSelector('[data-testid="checkbox"]')
    await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')

    // Check the checkbox "I confirm this address is not a Binance wallets...."
    await clickOnElement(page, '[data-testid="checkbox"]')

    // Check the checkbox "Confirm sending to a previously unknown address"
    await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')

    // Click on "Send" button and cofirm transaction
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
      '[data-testid="option-0x630fd7f359e483c28d2b0babde1a6f468a1d649e0x0000000000000000000000000000000000000000matic"]'
    )
    await new Promise((r) => setTimeout(r, 1000))
    // Sign and confirm the transaction
    await signTransaction(newPage)
    await confirmTransactionStatus(newPage, 'polygon', 137)
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('Make batched transaction', async () => {
    // Click on "Send" button
    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await page.waitForSelector(amountField)

    await selectMaticToken(page)

    // Type the amount
    await typeText(page, amountField, '0.0001')
    const firstRecipient = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'

    // Type the adress of the recipient
    await typeText(page, recipientField, firstRecipient)
    await page.waitForXPath(
      '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
    )
    await page.waitForSelector('[data-testid="checkbox"]')
    await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')

    // Check the checkbox "I confirm this address is not a Binance wallets...."
    await clickOnElement(page, '[data-testid="checkbox"]')

    // Check the checkbox "Confirm sending to a previously unknown address"
    await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')

    const elementToClick = await page.waitForSelector('[data-testid="transfer-button-send"]')
    await elementToClick.click()

    await new Promise((r) => setTimeout(r, 1000))

    const newTarget = await browser.waitForTarget((target) =>
      target.url().startsWith(`${extensionRootUrl}/action-window.html#`)
    )
    let newPage = await newTarget.page()
    await newPage.setViewport({
      width: 1300,
      height: 700
    })

    // Click on "Queue And Sign Later" button
    await clickOnElement(newPage, '[data-testid="queue-and-sign-later-button"]')

    await page.goto(`${extensionRootUrl}/tab.html#/dashboard`, { waitUntil: 'load' })

    // Verify that  message exist on the dashboard page
    const pendingText = 'Transaction waiting to be signed on Polygon'

    await page.waitForFunction(
      (text) => {
        const element = document.querySelector('body')
        return element && element.textContent.includes(text)
      },
      {},
      pendingText
    )

    await page.goto(`${extensionRootUrl}/tab.html#/transfer`, { waitUntil: 'load' })

    await page.waitForSelector(amountField)

    await selectMaticToken(page)

    // Type the amount
    await typeText(page, amountField, '0.0001')

    const secondRecipient = '0x630fd7f359e483C28d2b0BabDE1a6F468a1d649e'

    // Type the adress of the recipient
    await typeText(page, recipientField, secondRecipient)

    const sendButton = await page.waitForSelector('[data-testid="transfer-button-send"]')
    await sendButton.click()

    await new Promise((r) => setTimeout(r, 1000))

    const newTarget2 = await browser.waitForTarget((target) =>
      target.url().startsWith(`${extensionRootUrl}/action-window.html#`)
    )
    newPage = await newTarget2.page()
    newPage.setViewport({
      width: 1300,
      height: 700
    })
    await new Promise((r) => setTimeout(r, 2000))

    // Verify that both recipient addresses are visible ot the page
    await newPage.waitForFunction(
      (text1, text2) => {
        const element1 = document.querySelector('[data-testid^="recipient-address-0"]')
        const element2 = document.querySelector('[data-testid^="recipient-address-1"]')
        return (
          (element1 && element1.textContent.includes(text1)) ||
          (element2 && element2.textContent.includes(text2))
        )
      },
      {},
      firstRecipient,
      secondRecipient
    )

    // Check if select fee token is visible and select the token
    await selectFeeToken(
      newPage,
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
    )
    // Sign and confirm the transaction
    await signTransaction(newPage)
    await confirmTransactionStatus(newPage, 'polygon', 137)

    // Verify that both recipient addresses are visible
    await newPage.waitForFunction(
      (text1, text2) => {
        const body = document.querySelector('body')
        return body.textContent.includes(text1) && body.textContent.includes(text2)
      },
      {},
      firstRecipient,
      secondRecipient
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('4337 transaction', async () => {
    // Click on Matic (not Gas Tank token)
    await clickOnElement(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-optimism"]'
    )

    const buttonSelector = '[data-testid="top-up-button"]'
    // Wait for the button to appear in the DOM
    await page.waitForSelector(buttonSelector)

    // Wait for the button to be visible and enabled
    await page.waitForFunction(
      (selector) => {
        const button = document.querySelector(selector)
        return button && button.offsetParent !== null && !button.disabled
      },
      {},
      buttonSelector
    )

    // Click on "Top Up Gas Tank"
    await clickOnElement(page, '[data-testid="token-send"]')

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/transfer')
      },
      { timeout: 60000 }
    )

    await page.waitForSelector('[data-testid="amount-field"]')
    // await selectMaticToken(page)
    await typeText(page, '[data-testid="amount-field"]', '0.000001') // Type the amount

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

    // Click on "Send" button and cofirm transaction
    const newPage = await triggerTransaction(
      page,
      browser,
      extensionRootUrl,
      '[data-testid="transfer-button-send"]'
    )
    await new Promise((r) => setTimeout(r, 2000))

    // // Check if "sign-message" window is open
    // const result = await checkForSignMessageWindow(newPage, extensionRootUrl, browser)
    // newPage = result.newPage

    // Check if select fee token is visible and select the token
    await selectFeeToken(
      newPage,
      '[data-testid="option-0x630fd7f359e483c28d2b0babde1a6f468a1d649e0x0000000000000000000000000000000000000000eth"]'
    )
    await new Promise((r) => setTimeout(r, 1000))

    // Sign and confirm the transaction
    await signTransaction(newPage)
    await confirmTransactionStatus(newPage, 'optimism', 10)
  })
})
