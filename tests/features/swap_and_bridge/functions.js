import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
// ToDo: Import and reuse '../../common/selectors/selectors'
// ToDo: Import and reuse '../../common/transactions'
// ToDo: Create and use './constants' file

export async function enterNumber(page, new_amount, is_valid = true) {
  const message = 'Something went wrong! Please contact support'
  // Enter the amount
  await typeText(page, 'input[placeholder="0"]', new_amount.toString())
  console.log(`[INFO] Enetered ${new_amount} as the amount to send.`)
  // Assert if the message should be displayed
  if (is_valid) {
    await expect(page).not.toMatchElement('span', { text: `${message}` })
  } else {
    await expect(page).toMatchElement('span', { text: `${message}` })
  }
}

export async function prepareSwapAndBridge(page, send_amount, send_token, send_network, receive_token) {
  try {
    console.log('[INFO] Building swap transaction...')

    // Select Swap and Bridge
    await clickOnElement(page, '[data-testid="dashboard-button-swap-and-bridge"]')
    console.log('[INFO] Navigated to Swap & Bridge.')

    // Select Send Token on Network
    await clickOnElement(page, '[data-testid="from-token-select"]')
    await clickOnElement(page, `[data-testid*="${send_network}.${send_token}"]`)

    // Select Receive Token on the same Network, which is automatically selected
    await page.waitForTimeout(1000) // Wait 500ms before click for the Receive Token list to be populated
    await clickOnElement(page, '[data-testid="to-token-select"]')
    await clickOnElement(page, `[data-testid*="${receive_token}"]`)
    console.log(`[INFO] Selected ${receive_token} token to receive.`)

    // Ensure a valid send amount is provided
    if (send_amount === null || send_amount <= 0) {
      throw new Error('"send_amount" must be greater than 0')
    }

    // Enter the amount
    await typeText(page, 'input[placeholder="0"]', send_amount.toString())
    console.log(`[INFO] Entered ${send_amount} as the amount to send.`)

    // Wait for Proceed to be enabled, i.e., wait for "Fetching best route..." text to appear and disappear
    await page.waitForSelector('text=Fetching best route...', { visible: true })
    await page.waitForSelector('text=Fetching best route...', { hidden: true })

    // ToDo: Handle The price impact is too high
    await expect(page).not.toMatchElement('[data-testid="checkbox"]')
  } catch (error) {
    console.error(`[ERROR] Swap Transaction Preparation Failed: ${error.message}`)
    throw error
  }
}

export async function proceedSwapAndBridge(page) {
  try {
    // Get the browser context of the page
    const context = page.browserContext()

    const [newPagePromise] = await Promise.all([
      new Promise((resolve) => {
        context.once('targetcreated', async (target) => {
          const newPage = await target.page()
          resolve(newPage)
        })
      }),

      // Select Proceed Button
      await clickOnElement(page, 'text=Proceed')
    ])

    // Use newPage for interactions the with new page
    const newPage = await newPagePromise

    // Wait for new page to open
    await newPage.waitForTimeout(1500)

    // Select Sign
    await clickOnElement(newPage, 'text=Sign')
    console.log('[INFO] Clicked Sign')

    // Wait for transaction to be confirmed
    await newPage.waitForSelector('text=Timestamp', { visible: true })

    // Asset if the transaction is confirmed
    await expect(newPage).toMatchElement('div', { text: 'Confirmed' })
    // eslint-disable-next-line no-console
    console.log('[INFO] Transaction Confirmed')
  } catch (error) {
    console.error(`[ERROR] Sign Swap Transaction Failed: ${error.message}`)
    throw error
  }
}
