import { locators } from '@common/locators'
import { expect } from '@playwright/test'

import { bootstrapWithStorage } from '../common-helpers/bootstrap'
import { BasePage } from './basePage'

export class DashboardPage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('dashboard', param)
    this.page = page
  }

  async checkBalanceInAccount(): Promise<void> {
    await this.page.waitForFunction(() => window.location.href.includes('/dashboard'))
    await this.page.waitForSelector(locators.fullAmountDashboard)
    const amountText = await this.page.locator(locators.fullAmountDashboard).innerText()
    const amountNumber = parseFloat(amountText.replace(/[^\d.]/g, ''))
    expect(amountNumber).toBeGreaterThan(0)
  }

  async checkIfTokensExist(): Promise<void> {
    const TOKEN_SYMBOLS = ['BTC', 'ETH', 'USDT']
    await this.page.waitForFunction(() => window.location.href.includes('/dashboard'))
    await this.page.waitForSelector(locators.fullAmountDashboard)
    const innerTextOfTheWholePage = await this.page.innerText('body')
    const foundToken = TOKEN_SYMBOLS.find((token) => innerTextOfTheWholePage.includes(token))
    expect(foundToken).toBeTruthy()
  }
}
