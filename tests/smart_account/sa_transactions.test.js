import { ethers } from 'ethers'
import {
  typeText,
  clickOnElement,
  bootstrapWithStorage,
  saParams,
  confirmTransaction,
  selectMaticToken
} from '../functions.js'

import {
  makeValidTransaction,
  makeSwap,
  sendFundsGreaterThatBalance,
  sendFundsToSmartContract,
  signMessage
} from '../common/transactions.js'

const recipientField = '[data-testid="address-ens-field"]'
const amountField = '[data-testid="amount-field"]'

let browser
let page
let extensionRootUrl
let recorder

describe('sa_transactions', () => {
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
    await makeValidTransaction(page, extensionRootUrl, browser)
  })

  // Exclude the SWAP test for now, as it occasionally fails. We'll reintroduce it once we've made improvements.
  it('Make valid swap ', async () => {
    await makeSwap(page, extensionRootUrl, browser)
  })
  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send matics greater than the available balance ', async () => {
    await sendFundsGreaterThatBalance(page, extensionRootUrl)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send matics to smart contract ', async () => {
    await sendFundsToSmartContract(page, extensionRootUrl)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Sign message', async () => {
    await signMessage(page, extensionRootUrl, browser, process.env.SA_SELECTED_ACCOUNT)
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
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      '[data-testid="transfer-button-send"]',
      '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000maticgastank"]'
    )
  })
})

describe.skip('sa_transactions_with_new_storage', () => {
  beforeEach(async () => {
    const newValues = {
      parsedKeystoreSecrets: JSON.parse(process.env.A2_SECRETS),
      parsedKeystoreKeys: JSON.parse(process.env.A2_KEYS),
      parsedKeystoreAccounts: JSON.parse(process.env.A2_ACCOUNTS)
    }

    const context = await bootstrapWithStorage('sa_transactions', {
      ...saParams,
      ...newValues
    })

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
    await confirmTransaction(
      page,
      extensionRootUrl,
      browser,
      '[data-testid="transfer-button-send"]',
      '[data-testid="option-0x630fd7f359e483c28d2b0babde1a6f468a1d649e0x0000000000000000000000000000000000000000matic"]'
    )
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Make batched transaction', async () => {
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
    // await page.waitForXPath(
    //   '//div[contains(text(), "You\'re trying to send to an unknown address. If you\'re really sure, confirm using the checkbox below.")]'
    // )
    // await page.waitForSelector('[data-testid="checkbox"]')
    // await page.waitForSelector('[data-testid="recipient-address-unknown-checkbox"]')

    // /* Check the checkbox "I confirm this address is not a Binance wallets...."
    // await clickOnElement(page, '[data-testid="checkbox"]')

    // /* Check the checkbox "Confirm sending to a previously unknown address"
    // await clickOnElement(page, '[data-testid="recipient-address-unknown-checkbox"]')

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
    // Check if select fee token is visible
    const selectToken = await newPage.evaluate(() => {
      return !!document.querySelector('[data-testid="tokens-select"]')
    })

    if (selectToken) {
      // Get the text content of the element
      const selectText = await newPage.evaluate(() => {
        const element = document.querySelector('[data-testid="tokens-select"]')
        return element.textContent.trim()
      })

      // Check if the text contains "Gas Tank". It means that pay fee by gas tank is selected
      if (selectText.includes('Gas Tank')) {
        // Click on the tokens select
        await clickOnElement(newPage, '[data-testid="tokens-select"]')
        // Wait for some time
        await new Promise((r) => setTimeout(r, 2000))

        // Click on the Gas Tank option
        await clickOnElement(
          newPage,
          '[data-testid="option-0x6224438b995c2d49f696136b2cb3fcafb21bd1e70x0000000000000000000000000000000000000000matic"]'
        )
      }
    }
    // Click on "Ape" button
    await clickOnElement(newPage, '[data-testid="fee-ape:"]')

    // Click on "Sign" button
    await clickOnElement(newPage, '[data-testid="transaction-button-sign"]')
    // Wait for the 'Timestamp' text to appear twice on the page
    await newPage.waitForFunction(
      () => {
        const transactionText = document.documentElement.innerText
        const occurrences = (transactionText.match(/Timestamp/g) || []).length
        return occurrences >= 2
      },
      { timeout: 250000 }
    )

    const doesFailedExist = await newPage.evaluate(() => {
      const failedText = document.documentElement.innerText
      return failedText.includes('failed') || failedText.includes('dropped')
    })

    await new Promise((r) => setTimeout(r, 300))

    expect(doesFailedExist).toBe(false) // This will fail the test if 'failed' or 'dropped' exists

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

    const currentURL = await newPage.url()

    // Split the URL by the '=' character and get the transaction hash
    const parts = currentURL.split('=')
    const transactionHash = parts[parts.length - 1]

    //  Define the RPC URL for the Polygon network
    const rpcUrl = 'https://invictus.ambire.com/polygon'

    // Create a provider instance using the JsonRpcProvider
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(transactionHash)

    console.log(`Batched Transaction Hash: ${transactionHash}`)

    expect(receipt.status).toBe(1) // Assertion to fail the test if transaction failed
  })
})
