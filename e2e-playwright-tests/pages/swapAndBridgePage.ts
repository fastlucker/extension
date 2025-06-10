import { expect } from '@playwright/test'

import { bootstrapWithStorage } from '../common-helpers/bootstrap'
import { clickOnElement } from '../common-helpers/clickOnElement'
import { typeText } from '../common-helpers/typeText'
import { SELECTORS } from '../common/selectors/selectors'
import { BasePage } from './basePage'
import Token from '../interfaces/token'

export class SwapAndBridgePage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('swapAndBridgeBA', param)
    this.page = page // Initialize the POM page property with the Playwright page instance
  }

  // General function
  roundAmount(amount, place = 2) {
    // ToDo: Check if values should be int-ed or rounded. Values are currently int-ed
    const multipla = 10 ** place
    return Math.trunc(amount * multipla) / multipla
  }

  // General function
  async getElement(selector) {
    const element = await this.page.$(selector)
    expect(element).not.toBeNull()
    return element
  }

  // General function
  async selectFirstButton(text) {
    await clickOnElement(this.page, `text=${text}`)
  }

  // General function
  async getElementValue(selector) {
    const element = await this.getElement(selector)
    const content = await element.evaluate((el) => el.value.trim())
    return content
  }

  async verifyIfOnSwapAndBridgePage() {
    await expect(this.page.getByText('Swap & Bridge', { exact: true })).toBeVisible()
    expect(this.page.url()).toContain('/swap-and-bridge')
  }

  async getElementContentWords(selector, index = 1) {
    const element = await this.getElement(selector)
    const content = (await element.evaluate((el) => el.textContent.trim())).split(' ')[index - 1]
    return content
  }

  async extractMaxBalance() {
    const maxBalanceIndex = 1
    const maxBalance = await this.getElementContentWords(
      SELECTORS.maxAvailableAmount,
      maxBalanceIndex
    )
    return Number(maxBalance)
  }

  async getSendAmount() {
    const amount = await this.getElementValue(SELECTORS.fromAmountInputSab)
    return Number(amount)
  }

  async enterNumber(new_amount, is_valid = true) {
    const message = 'Something went wrong! Please contact support'
    // Enter the amount
    await typeText(this.page, SELECTORS.fromAmountInputSab, new_amount.toString())
    // Assert if the message should be displayed
    if (is_valid) {
      await expect(this.page.locator(`span:has-text("${message}")`)).not.toBeVisible()
    } else {
      await expect(this.page.locator(`span:has-text("${message}")`)).toBeVisible()
    }
  }

  async switchTokensOnSwapAndBridge(delay = 500) {
    await this.page.waitForTimeout(delay)

    // Extract text content from the elements
    const sendToken = await this.getElementContentWords(SELECTORS.sendTokenSab)
    const receiveToken = await this.getElementContentWords(SELECTORS.receiveTokenSab)
    // TODO: Selector should be created to have data-testid this is not maintainable
    // const network = await getElementContentWords(page, NETWORK_SELECTOR)
    const network = await this.getElementContentWords(SELECTORS.recieveNetworkBase)

    // Click the switch Tokens button
    await clickOnElement(this.page, SELECTORS.switchTokensTooltipSab)

    // Ensure the tokens are switched
    await this.page.waitForTimeout(500)
    expect(await this.getElementContentWords(SELECTORS.sendTokenSab)).toBe(receiveToken)
    expect(await this.getElementContentWords(SELECTORS.receiveTokenSab)).toBe(sendToken)

    // Network name is 3rd word in the sendToken content
    expect(await this.getElementContentWords(SELECTORS.sendTokenSab, 3)).toBe(network)
  }

  async openSwapAndBridge() {
    if (!this.page.url().includes('/swap-and-bridge')) {
      await clickOnElement(this.page, SELECTORS.dashboardButtonSwapAndBridge)
      await this.verifyIfOnSwapAndBridgePage()
    }
  }

  async prepareSwapAndBridge(send_amount, fromToken: Token, toToken: Token) {
    try {
      await this.openSwapAndBridge()
      await this.page.waitForTimeout(1000)
      await this.selectSendTokenOnNetwork(fromToken)

      // Select Receive Token on the same Network, which is automatically selected
      await this.page.waitForTimeout(1000) // Wait 1000ms before click for the Receive Token list to be populated
      await this.clickOnMenuToken(toToken, SELECTORS.receiveTokenSab)

      // If checking prepareSwapAndBridge functionality without providing send amount
      if (send_amount === null) {
        return null
      }

      // If a valid send amount is not provided
      if (send_amount <= 0) {
        throw new Error('send_amount" must be greater than 0')
      }

      // Enter the amount
      await typeText(this.page, SELECTORS.fromAmountInputSab, send_amount.toString())

      // TODO: Implement verifyRouteFound
      // await verifyRouteFound()

      // If Warning: The price impact is too high
      const isHighPrice = await this.page
        .waitForSelector(SELECTORS.highPriceImpactSab, { timeout: 1000 })
        .catch(() => null)
      if (isHighPrice) {
        await clickOnElement(this.page, SELECTORS.highPriceImpactSab)
        return 'Continue anyway'
      }
      return 'Proceed'
    } catch (error) {
      console.error(`[ERROR] Prepare Swap & Bridge Page Failed: ${error.message}`)
      throw error
    }
  }

  async selectSendTokenOnNetwork(send_token: Token) {
    await this.clickOnMenuToken(send_token, SELECTORS.sendTokenSab)
  }

  async verifyIfSwitchIsActive(reference = true) {
    await this.page.waitForTimeout(500)

    const switchElement = await this.page.$(SELECTORS.switchTokensTooltipSab)

    const isDisabled = await this.page.evaluate((element) => {
      const firstChild = element.children[0]
      return firstChild ? firstChild.getAttribute('aria-disabled') === 'true' : false
    }, switchElement)

    const isActive = !isDisabled
    expect(isActive).toBe(reference)
  }

  async verifySendMaxTokenAmount(fromToken: Token) {
    const valueDecimals = 2 // Set presison of values to 2 decimals
    await this.openSwapAndBridge()
    await this.selectSendTokenOnNetwork(fromToken)
    await this.page.waitForTimeout(500) // Wait before read Amount value
    const maxBalance = await this.extractMaxBalance()
    const roundMaxBalance = this.roundAmount(maxBalance, valueDecimals)
    await this.selectFirstButton('Max')
    await this.page.waitForTimeout(500) // Wait before read Amount value
    const sendAmount = await this.getSendAmount()
    const roundSendAmount = await this.roundAmount(sendAmount, valueDecimals)
    // There is an intermittent difference in balances when running on CI; I have added an Alert to monitor it and using toBeCloseTo
    if (roundMaxBalance !== roundSendAmount) {
      console.log(
        `⚠️ Token: ${fromToken} | maxBalance: ${maxBalance}, sendAmount: ${sendAmount} | roundSendAmount: ${roundSendAmount}, roundMaxBalance: ${roundMaxBalance}`
      )
    }
    expect(roundMaxBalance).toBeCloseTo(roundSendAmount, valueDecimals - 1) // 1 decimal presisison
  }

  async navigateToHome() {
    await this.page.goto('/')
  }
}
