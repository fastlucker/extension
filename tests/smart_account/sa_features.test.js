import {
  typeText,
  clickOnElement,
  bootstrapWithStorage,
  saParams,
  selectMaticToken,
  triggerTransaction,
  signTransaction,
  confirmTransactionStatus,
  selectFeeToken,
  checkBalanceOfToken
} from '../functions'

const recipientField = '[data-testid="address-ens-field"]'
const amountField = '[data-testid="amount-field"]'

// Helper functions for common operations
async function prepareTransaction(page, recipient, amount) {
  await page.waitForSelector(amountField)
  await selectMaticToken(page)
  await typeText(page, amountField, amount)
  await typeText(page, recipientField, recipient)
  await page.waitForXPath(
    '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
  )
  await page.waitForSelector('[data-testid="checkbox"]')
  await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')
  await clickOnElement(page, '[data-testid="checkbox"]')
  await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')
}

async function handleTransaction(page, extensionURL, browser, feeToken) {
  const { actionWindowPage: newPage, transactionRecorder } = await triggerTransaction(
    page,
    extensionURL,
    browser,
    '[data-testid="transfer-button-confirm"]'
  )

  if (feeToken) {
    await selectFeeToken(newPage, feeToken)
  }

  await signTransaction(newPage, transactionRecorder)
  await confirmTransactionStatus(newPage, 'polygon', 137, transactionRecorder)
}

let browser
let page
let extensionURL
let recorder

describe('sa_features', () => {
  beforeEach(async () => {
    const context = await bootstrapWithStorage('sa_features', saParams)
    browser = context.browser
    page = context.page
    recorder = context.recorder
    extensionURL = context.extensionURL
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  // This test is skipped because Top up Gas Tank option is temporarily disabled.
  it.skip('Top up gas tank with 0.0001 MATIC', async () => {
    // Check if MATIC on Gas Tank are under 0.01
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-polygon"]',
      0.01
    )

    await clickOnElement(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-polygon"]'
    )
    await clickOnElement(page, '[data-testid="top-up-button"]')

    await page.waitForFunction(() => window.location.href.includes('/transfer'), { timeout: 60000 })

    await prepareTransaction(page, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C', '0.0001')
    await handleTransaction(
      page,
      extensionURL,
      browser,
      '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000matic"]'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Pay transaction fee with gas tank', async () => {
    // Check if MATIC on Gas Tank are under 0.007
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270-polygon-gastank"]',
      0.01
    )

    await clickOnElement(page, '[data-testid="dashboard-button-send"]')
    await prepareTransaction(page, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C', '0.0001')
    await handleTransaction(
      page,
      extensionURL,
      browser,
      '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270wmaticgastank"]'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Pay transaction fee with basic account. Send 0.0001 MATIC on Polygon', async () => {
    // Check if MATIC on Polygon are under 0.0001
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-polygon"]',
      0.0001
    )

    await page.goto(`${extensionURL}/tab.html#/transfer`, { waitUntil: 'load' })
    await prepareTransaction(page, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C', '0.0001')
    await handleTransaction(
      page,
      extensionURL,
      browser,
      '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000matic"]'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Make batched transaction', async () => {
    // Check if MATIC on Polygon are under 0.0015
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-polygon"]',
      0.02
    )

    await page.goto(`${extensionURL}/tab.html#/transfer`, { waitUntil: 'load' })
    await prepareTransaction(page, '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C', '0.0001')

    const elementToClick = await page.waitForSelector('[data-testid="transfer-button-confirm"]')
    await elementToClick.click()

    const newTarget = await browser.waitForTarget((target) =>
      target.url().startsWith(`${extensionURL}/action-window.html#`)
    )
    const newPage = await newTarget.page()
    await newPage.setViewport({ width: 1300, height: 700 })
    await clickOnElement(newPage, '[data-testid="queue-and-sign-later-button"]')

    await page.goto(`${extensionURL}/tab.html#/dashboard`, { waitUntil: 'load' })
    const pendingText = 'Transaction waiting to be signed on Polygon'
    await page.waitForFunction(
      (text) => {
        const element = document.querySelector('body')
        return element && element.textContent.includes(text)
      },
      {},
      pendingText
    )

    await page.goto(`${extensionURL}/tab.html#/transfer`, { waitUntil: 'load' })
    await prepareTransaction(page, '0xe750Fff1AA867DFb52c9f98596a0faB5e05d30A6', '0.0001')

    const { actionWindowPage, transactionRecorder } = await triggerTransaction(
      page,
      extensionURL,
      browser,
      '[data-testid="transfer-button-confirm"]:not([disabled])'
    )
    await actionWindowPage.waitForFunction(
      (text1, text2) => {
        const element1 = document.querySelector('[data-testid^="recipient-address-0"]')
        const element2 = document.querySelector('[data-testid^="recipient-address-1"]')
        return (
          (element1 && element1.textContent.includes(text1)) ||
          (element2 && element2.textContent.includes(text2))
        )
      },
      {},
      '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C',
      '0xe750Fff1AA867DFb52c9f98596a0faB5e05d30A6'
    )
    await selectFeeToken(
      actionWindowPage,
      '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000matic"]'
    )
    await signTransaction(actionWindowPage, transactionRecorder)
    await confirmTransactionStatus(actionWindowPage, 'polygon', 137, transactionRecorder)

    await actionWindowPage.waitForFunction(
      (text1, text2) => {
        const body = document.querySelector('body')
        return body.textContent.includes(text1) && body.textContent.includes(text2)
      },
      {},
      '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C',
      '0xe750Fff1AA867DFb52c9f98596a0faB5e05d30A6'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('Send 0.00000001 ETH on Optimism.Pay with ETH', async () => {
    // Check if ETH in optimism are under 0.00000001
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-optimism"]',
      0.00000001
    )

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

    // Click on "Send"
    await clickOnElement(page, '[data-testid="token-send"]')

    await page.waitForFunction(
      () => {
        return window.location.href.includes('/transfer')
      },
      { timeout: 60000 }
    )

    await page.waitForSelector('[data-testid="amount-field"]')
    await typeText(page, '[data-testid="amount-field"]', '0.00000001')

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
    const { actionWindowPage: newPage, transactionRecorder } = await triggerTransaction(
      page,
      extensionURL,
      browser,
      '[data-testid="transfer-button-confirm"]'
    )

    // Check if select fee token is visible and select the token
    await selectFeeToken(
      newPage,
      '[data-testid="option-0x630fd7f359e483c28d2b0babde1a6f468a1d649e0x0000000000000000000000000000000000000000eth"]'
    )
    // Sign and confirm the transaction
    await signTransaction(newPage, transactionRecorder)
    await confirmTransactionStatus(newPage, 'optimism', 10, transactionRecorder)
  })

  //--------------------------------------------------------------------------------------------------------------
  it.skip('Check token balance needed for e2e tests', async () => {
    // Check if ETH in optimism are under  0.0000001
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-optimism"]',
      0.0000001
    )
    // Check if MATIC on Polygon are under 0.0015
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0000000000000000000000000000000000000000-polygon"]',
      0.02
    )
    // Check if MATIC on Gas Tank are under 0.007
    await checkBalanceOfToken(
      page,
      '[data-testid="token-0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270-polygon-gastank"]',
      0.01
    )
  })
})
