import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
// ToDo: Import and reuse '../../common/selectors/selectors'
// ToDo: Import and reuse '../../common/transactions'
// ToDo: Create and use './constants' file

export async function swapTransactionBA(page, amount, send_token, send_network, receive_token) {
  console.log('[INFO] Building swap transaction...')

  // Select Swap and Bridge
  await clickOnElement(page, '[data-testid="dashboard-button-swap-and-bridge"]')
  console.log('[INFO] Navigated to Swap & Bridge.')

  // Select Send Token on Network
  await clickOnElement(page, '[data-testid="from-token-select"]')
  await clickOnElement(page, `[data-testid*="${send_network}.${send_token}"]`)

  // Enter the amount
  await typeText(page, 'input[placeholder="0"]', amount.toString())
  console.log(`[INFO] Selected ${send_token} token on ${send_network} network to send.`)

  // Select Receive Token on the same Network, which is automatically selected
  await clickOnElement(page, '[data-testid="to-token-select"]')
  await clickOnElement(page, `[data-testid*="${receive_token}"]`)
  console.log(`[INFO] Selected ${receive_token} token to receive.`)

  // Wait for Proceed to be enabled
  await page.waitForSelector('text=Select another route', { visible: true })
  // await page.waitForTimeout(3000)

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

  // ### Use newPage in this until page is closed
  const newPage = await newPagePromise

  // Wait for new page to open
  await page.waitForTimeout(1500)

  // Select Sign
  await clickOnElement(newPage, 'text=Sign')
  console.log('[INFO] Clicked Sign')

  await clickOnElement(newPage, 'text=Close')
  console.log('[INFO] Clicked Sign')
  // ### End of using newPage

  // Select Back Button
  await clickOnElement(page, 'text=Back')
  // await page.locator('text=Back').click()
}
