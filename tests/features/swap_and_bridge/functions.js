import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
import { SELECTORS } from '../../common/selectors/selectors'
// ToDo: Import and reuse '../../common/transactions'
import {
  FETCHING_BEST_ROUTE,
  NETWORK_SELECTOR,
  ENTER_AMOUNT_SELECTOR,
  SWITCH_TOKENS_TOOLTIP_SELECTOR,
  SWITCH_TOKEN_SELECTOR,
  SWITCH_USD_SELECTOR,
  WARNING_THE_PRICE,
  RECIEVE_TOKEN_INPUT
} from './constants'

export async function selectButton(page, text) {
  await clickOnElement(page, `text=${text}`)
}

export async function checkIfOnDashboardPage(page) {
  await expect(page).toMatchElement(SELECTORS.dashboardButtonSwapAndBridge)
  expect(page.url()).toContain('/dashboard')
}

export async function checkIfOnSwapAndBridgePage(page) {
  await expect(page).toMatchElement('div', { text: 'Swap & Bridge' })
  expect(page.url()).toContain('/swap-and-bridge')
}

export async function openSwapAndBridge(page) {
  await clickOnElement(page, SELECTORS.dashboardButtonSwapAndBridge)
  await checkIfOnSwapAndBridgePage(page)
}

export async function checkIfSwitchIsActive(page, reference = true) {
  await page.waitForTimeout(500)
  const isActive = (await page.$(SWITCH_TOKENS_TOOLTIP_SELECTOR)) === null
  await expect(isActive).toBe(reference)
}

export async function clickSwitchTokensOnSwapAndBridge(page) {
  const [element] = await page.$x(SWITCH_TOKEN_SELECTOR)
  expect(element).not.toBeNull()
  await element.click()
}

export async function clickSwitchUSDOnSwapAndBridge(page) {
  const [element] = await page.$x(SWITCH_USD_SELECTOR)
  expect(element).not.toBeNull()
  // Find its parent
  const parentElement = await element.evaluateHandle((el) => el.parentElement)
  expect(parentElement).not.toBeNull()

  // Click the parent
  await parentElement.click()
}

async function getElement(page, selector) {
  const element = await page.$(selector)
  expect(element).not.toBeNull()
  return element
}

async function getElementValue(page, selector) {
  const element = await getElement(page, selector)
  const content = await element.evaluate((el) => el.value.trim())
  return content
}

async function getElementContentWords(page, selector, index = 1) {
  const element = await getElement(page, selector)
  const content = (await element.evaluate((el) => el.textContent.trim())).split(' ')[index - 1]
  return content
}

export async function switchTokensOnSwapAndBridge(page, delay = 500) {
  await page.waitForTimeout(delay)

  // Extract text content from the elements
  const sendToken = await getElementContentWords(page, SELECTORS.sendTokenSaB)
  const receiveToken = await getElementContentWords(page, SELECTORS.receiveTokenSaB)
  // TODO: Selector should be created to have data-testid this is not maintainable
  // const network = await getElementContentWords(page, NETWORK_SELECTOR)
  const network = await getElementContentWords(page, SELECTORS.recieveNetworkBase)

  // Click the switch Tokens button
  await clickSwitchTokensOnSwapAndBridge(page)

  // Ensure the tokens are switched
  expect(await getElementContentWords(page, SELECTORS.sendTokenSaB)).toBe(receiveToken)
  expect(await getElementContentWords(page, SELECTORS.receiveTokenSaB)).toBe(sendToken)

  // Network name is 3rd word in the sendToken content
  expect(await getElementContentWords(page, SELECTORS.sendTokenSaB, 3)).toBe(network)
}

async function getUSDTextContent(page) {
  // TODO: Selector should be created to have data-testid this is not maintainable
  const selector = SWITCH_USD_SELECTOR
  const [element] = await page.$x(selector)
  expect(element).not.toBeNull()
  const content = await element.evaluate((el) => el.textContent.trim())

  const match = content.match(/([\d,.]+)\s*([\w.]+)$/)

  const amount = match ? match[1] : null
  const currency = match ? match[2] : null

  return [Number(amount), currency]
}

async function getSendAmount(page) {
  const amount = await getElementValue(page, ENTER_AMOUNT_SELECTOR)
  return Number(amount)
}

async function roundAmount(amount) {
  // ToDo: Check if USD swithed value should be int-ed or rounded
  const changedAmount = Math.trunc(amount * 100) / 100
  return changedAmount
}

export async function switchUSDValueOnSwapAndBridge(
  page,
  send_token,
  send_network,
  send_amount,
  delay = 500
) {
  await page.waitForTimeout(delay)

  // Navigate to Swap and Bridge
  await openSwapAndBridge(page)

  // Select Send Token on Network
  await clickOnElement(page, SELECTORS.sendTokenSaB)
  await clickOnElement(page, `[data-testid*="${send_network}.${send_token.toLowerCase()}"]`)

  // Enter the amount
  await typeText(page, ENTER_AMOUNT_SELECTOR, send_amount.toString())

  // Get current values in the USD text contenet
  const [usdOldAmount, ccy] = await getUSDTextContent(page)
  expect(ccy).toBe('USD')
  const oldAmount = await getSendAmount(page)

  // Click the switch USD button
  await clickSwitchUSDOnSwapAndBridge(page)

  // Get new amounts
  const [usdNewAmount, newCcy] = await getUSDTextContent(page)
  const newAmount = await roundAmount(await getSendAmount(page))

  // Assert the amount and USD value are switched
  expect(oldAmount).toBe(usdNewAmount)
  expect(usdOldAmount).toBe(newAmount)
  expect(newCcy).toBe(send_token)

  // Wait 500ms and click again to the switch USD button
  await page.waitForTimeout(500)
  await clickSwitchUSDOnSwapAndBridge(page)

  // Get second amounts
  const [usdSecondAmount, secondCcy] = await getUSDTextContent(page)
  const secondAmount = await getSendAmount(page)

  // Assert the amount and USD value are switched again
  expect(newAmount).toBe(usdSecondAmount)
  expect(usdNewAmount).toBe(secondAmount)
  expect(secondCcy).toBe('USD')

  // Return back to Dashboard
  await selectButton(page, 'Back')
}

export async function enterNumber(page, new_amount, is_valid = true) {
  const message = 'Something went wrong! Please contact support'
  // Enter the amount
  await typeText(page, ENTER_AMOUNT_SELECTOR, new_amount.toString())
  // Assert if the message should be displayed
  if (is_valid) {
    await expect(page).not.toMatchElement('span', { text: `${message}` })
  } else {
    await expect(page).toMatchElement('span', { text: `${message}` })
  }
}

export async function bridgeBasicAccount(
  page,
  send_token,
  send_network,
  recieve_network,
  receive_token
) {
  await clickOnElement(page, SELECTORS.sendTokenSaB)
  await clickOnElement(
    page,
    `[data-testid*="${send_network.toLowerCase()}.${send_token.toLowerCase()}"]`
  )
  await clickOnElement(page, SELECTORS.recieveNetworkBase)
  await clickOnElement(page, `[data-testid*="option-${recieve_network}"]`)
  await page.waitForTimeout(1000)
  await clickOnElement(page, SELECTORS.receiveTokenSaB)
  await typeText(page, RECIEVE_TOKEN_INPUT, send_token)
  // It picking ETH all the time, should be investigated
  // await clickOnElement(page, `[data-testid*="${receive_token.toLowerCase()}"]`)
  await clickOnElement(page, receive_token)

  await page.waitForSelector(FETCHING_BEST_ROUTE, { visible: true })
  await page.waitForSelector(FETCHING_BEST_ROUTE, { hidden: true })

  await clickOnElement(page, SELECTORS.confirmFollowUpTxn)

  try {
    // If Warning: The price impact is too high
    if (await page.waitForSelector(WARNING_THE_PRICE, { visible: true })) {
      // If Warning: The price impact is too high
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    }
    return 'Continue anyway'
  } catch (error) {
    return 'Proceed'
  }
}

export async function bridgeSmartAccount(
  page,
  send_token,
  send_network,
  recieve_network,
  receive_token
) {
  await clickOnElement(page, SELECTORS.sendTokenSaB)
  await clickOnElement(
    page,
    `[data-testid*="${send_network.toLowerCase()}.${send_token.toLowerCase()}"]`
  )
  await clickOnElement(page, SELECTORS.recieveNetworkBase)
  await clickOnElement(page, `[data-testid*="option-${recieve_network}"]`)
  await page.waitForTimeout(1000)
  await clickOnElement(page, SELECTORS.receiveTokenSaB)
  await typeText(page, RECIEVE_TOKEN_INPUT, send_token)
  // It picking ETH all the time, should be investigated
  // await clickOnElement(page, `[data-testid*="${receive_token.toLowerCase()}"]`)
  await clickOnElement(page, receive_token)

  await page.waitForSelector(FETCHING_BEST_ROUTE, { visible: true })
  await page.waitForSelector(FETCHING_BEST_ROUTE, { hidden: true })

  try {
    // If Warning: The price impact is too high
    await page.waitForSelector(SELECTORS.continueAnywayCheckboxSaB, { timeout: 1000 })
    await clickOnElement(page, SELECTORS.continueAnywayCheckboxSaB)
    return 'Continue anyway'
  } catch (error) {
    return 'Proceed'
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
    await clickOnElement(
      page,
      `[data-testid*="${send_network.toLowerCase()}.${send_token.toLowerCase()}"]`
    )

    // Select Receive Token on the same Network, which is automatically selected
    await page.waitForTimeout(1000) // Wait 1000ms before click for the Receive Token list to be populated
    await clickOnElement(page, SELECTORS.receiveTokenSaB)
    await clickOnElement(page, `[data-testid*="${receive_token.toLowerCase()}"]`)

    // If checking prepareSwapAndBridge functionality without providing send amount
    if (send_amount === null) {
      return null
    }

    // If a valid send amount is not provided
    if (send_amount <= 0) {
      throw new Error('"send_amount" must be greater than 0')
    }

    // Enter the amount
    await typeText(page, ENTER_AMOUNT_SELECTOR, send_amount.toString())

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
    console.error(`[ERROR] Prepare Swap & Bridge Page Failed: ${error.message}`)
    throw error
  }
}

export async function openSwapAndBridgeActionPage(page, callback = 'null') {
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
    await clickOnElement(actionPage, SELECTORS.signTransactionButton)

    // Wait for transaction to be confirmed
    await actionPage.waitForSelector('text=Timestamp', { visible: true })

    // Asset if the transaction is confirmed
    await expect(actionPage).toMatchElement('div', { text: 'Confirmed' })
  } catch (error) {
    console.error(`[ERROR] Sign Swap Transaction Failed: ${error.message}`)
    throw error
  }
}
