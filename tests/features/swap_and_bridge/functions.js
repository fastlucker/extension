import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
import { SELECTORS } from '../../common/selectors/selectors'
// ToDo: Import and reuse '../../common/transactions'
import { FETCHING_BEST_ROUTE, NETWORK_SELECTOR, SWITCH_BUTTON_SELECTOR } from './constants'

export async function checkIfOnDashboardPage(page) {
  // Assert if the page is Dashboard
  await expect(page).toMatchElement(SELECTORS.dashboardButtonSwapAndBridge)
  expect(page.url()).toContain('/dashboard')
}

export async function checkIfOnSwapAndBridgePage(page) {
  // Assert if the page is Swap & Bridge
  await expect(page).toMatchElement('div', { text: 'Swap & Bridge' })
  expect(page.url()).toContain('/swap-and-bridge')
}

export async function openSwapAndBridge(page) {
  // Select Swap and Bridge from Dashboard
  await clickOnElement(page, SELECTORS.dashboardButtonSwapAndBridge)
  await checkIfOnSwapAndBridgePage(page)
}

export async function checkIfSwitchIsActive(page, reference = true) {
  await page.waitForTimeout(500)
  const isActive = (await page.$('[data-tooltip-id="switch-tokens-condition-tooltip"]')) === null
  await expect(isActive).toBe(reference)
}

export async function clickSwitcOnSwapAndBridge(page) {
  const [element] = await page.$x(SWITCH_BUTTON_SELECTOR)
  expect(element).not.toBeNull()
  await element.click()
}

async function getElement(page, selector) {
  const element = await page.$(selector)
  expect(element).not.toBeNull()
  return element
}

async function getElementContentWord(page, selector, index = 1) {
  const element = await getElement(page, selector)
  const content = (await element.evaluate((el) => el.textContent.trim())).split(' ')[index - 1]
  return content
}

export async function switchTokensOnSwapAndBridge(page, delay = 500) {
  await page.waitForTimeout(delay)

  // Extract text content from the elements
  const sendToken = await getElementContentWord(page, SELECTORS.sendTokenSaB)
  const receiveToken = await getElementContentWord(page, SELECTORS.receiveTokenSaB)
  const network = await getElementContentWord(page, NETWORK_SELECTOR)

  // Click the switch button
  await clickSwitcOnSwapAndBridge(page)

  // Ensure the tokens are switched
  expect(await getElementContentWord(page, SELECTORS.sendTokenSaB)).toBe(receiveToken)
  expect(await getElementContentWord(page, SELECTORS.receiveTokenSaB)).toBe(sendToken)

  // Network name is 3rd word in the sendToken content
  expect(await getElementContentWord(page, SELECTORS.sendTokenSaB, 3)).toBe(network)
}

export async function selectButton(page, text) {
  await clickOnElement(page, `text=${text}`)
}

export async function enterNumber(page, new_amount, is_valid = true) {
  const message = 'Something went wrong! Please contact support'
  // Enter the amount
  await typeText(page, 'input[placeholder="0"]', new_amount.toString())
  // Assert if the message should be displayed
  if (is_valid) {
    await expect(page).not.toMatchElement('span', { text: `${message}` })
  } else {
    await expect(page).toMatchElement('span', { text: `${message}` })
  }
}

export async function prepareSwapAndBridge(
  page,
  send_amount,
  send_token,
  send_network,
  receive_token
) {
  try {
    // Navigate to Swap and Bridge
    await openSwapAndBridge(page)

    // Select Send Token on Network
    await clickOnElement(page, SELECTORS.sendTokenSaB)
    await clickOnElement(page, `[data-testid*="${send_network}.${send_token}"]`)

    // Select Receive Token on the same Network, which is automatically selected
    await page.waitForTimeout(1000) // Wait 1000ms before click for the Receive Token list to be populated
    await clickOnElement(page, SELECTORS.receiveTokenSaB)
    await clickOnElement(page, `[data-testid*="${receive_token}"]`)

    // If checking prepareSwapAndBridge functionality without providing send amount
    if (send_amount === null) {
      return null
    }

    // If a valid send amount is not provided
    if (send_amount <= 0) {
      throw new Error('"send_amount" must be greater than 0')
    }

    // Enter the amount
    await typeText(page, 'input[placeholder="0"]', send_amount.toString())

    // Wait for Proceed to be enabled, i.e., wait for "Fetching best route..." text to appear and disappear
    await page.waitForSelector(FETCHING_BEST_ROUTE, { visible: true })
    await page.waitForSelector(FETCHING_BEST_ROUTE, { hidden: true })

    // ToDo: Handle 'No route found' situation

    try {
      // If Warning: The price impact is too high
      await page.waitForSelector(SELECTORS.continueAnywayCheckboxSaB, { timeout: 1000 })
      await clickOnElement(page, SELECTORS.continueAnywayCheckboxSaB)
      return 'Continue anyway'
    } catch (error) {
      return 'Proceed'
    }
  } catch (error) {
    console.error(`[ERROR] Preoare Swap & Bridge Page Failed: ${error.message}`)
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

    // Assert the Action Page to open
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })

    return actionPage
  } catch (error) {
    console.error(`[ERROR] Open Swap & Bridge Action Page Failed: ${error.message}`)
    throw error
  }
}

export async function signActionPage(actionPage) {
  try {
    // Select Sign
    await clickOnElement(actionPage, 'text=Sign')

    // Wait for transaction to be confirmed
    await actionPage.waitForSelector('text=Timestamp', { visible: true })

    // Asset if the transaction is confirmed
    await expect(actionPage).toMatchElement('div', { text: 'Confirmed' })
  } catch (error) {
    console.error(`[ERROR] Sign Swap Transaction Failed: ${error.message}`)
    throw error
  }
}
