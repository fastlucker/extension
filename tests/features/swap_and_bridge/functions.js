import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
// ToDo: Import and reuse '../../common/selectors/selectors'
// ToDo: Import and reuse '../../common/transactions'
// ToDo: Create and use './constants' file

export async function selectButton(pg, text) {
  // Select Back Button
  await clickOnElement(pg, `text=${text}`)
  console.log(`[INFO] Clicked ${text}`)
}

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
  // ToDo: Refactor to use SELECTORS common practice instead of hardcoding selectors
  try {
    console.log('[INFO] Building swap transaction...')

    // Select Swap and Bridge
    await clickOnElement(page, '[data-testid="dashboard-button-swap-and-bridge"]')
    console.log('[INFO] Navigated to Swap & Bridge.')

    // Select Send Token on Network
    await clickOnElement(page, '[data-testid="from-token-select"]')
    await clickOnElement(page, `[data-testid*="${send_network}.${send_token}"]`)

    // Select Receive Token on the same Network, which is automatically selected
    await page.waitForTimeout(1000) // Wait 1000ms before click for the Receive Token list to be populated
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

    // ToDo: Handle 'No route found' situation - low pty

    try {
      // If Warning: The price impact is too high
      await page.waitForSelector('[data-testid="checkbox"]', { timeout: 1000 })
      await clickOnElement(page, '[data-testid="checkbox"]')
      return 'Continue anyway'
    } catch (error) {
      return 'Proceed'
    }
  } catch (error) {
    console.error(`[ERROR] Swap Transaction Preparation Failed: ${error.message}`)
    throw error
  }
}

export async function openSwapAndBridgeActionPage(page, callback = null) {
  try {
    // Get the browser context of the page
    const context = page.browserContext()

    const [actionPagePromise] = await Promise.all([
      new Promise((resolve) => {
        context.once('targetcreated', async (target) => {
          const actionPage = await target.page()
          resolve(actionPage)
        })
      }),
      // The callback function to be executed
      await callback(page)
    ])

    // Use actionPage for interactions the with Action Page
    const actionPage = await actionPagePromise

    // Wait for Action Page to open
    await actionPage.waitForTimeout(1500)

    // Assert the Action Page is opened
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })

    return actionPage
  } catch (error) {
    console.error(`[ERROR] Proceed Swap Transaction Failed: ${error.message}`)
    throw error
  }
}

export async function signActionPage(actionPage) {
  try {
    // Select Sign
    await clickOnElement(actionPage, 'text=Sign')
    console.log('[INFO] Clicked Sign')

    // Wait for transaction to be confirmed
    await actionPage.waitForSelector('text=Timestamp', { visible: true })

    // Asset if the transaction is confirmed
    await expect(actionPage).toMatchElement('div', { text: 'Confirmed' })
    console.log('[INFO] Transaction Confirmed')
  } catch (error) {
    console.error(`[ERROR] Sign Swap Transaction Failed: ${error.message}`)
    throw error
  }
}
