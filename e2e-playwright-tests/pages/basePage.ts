import { Page } from '@playwright/test'
import Token from '../interfaces/token'
import { TEST_IDS } from '../common/selectors/selectors'

export abstract class BasePage {
  page: Page

  abstract init(param?): Promise<void> // ⛔ Must be implemented in subclasses

  async navigateToHome() {
    await this.page.goto('/')
  }

  async clickOnElement(element: string): Promise<void> {
    await this.page.locator(element).click()
  }

  async clickOnMenuToken(token: Token) {
    const tokensSelect = this.page.getByTestId(TEST_IDS.tokensSelect)
    await tokensSelect.click()

    // If the token is outside the viewport, we ensure it becomes visible by searching for its symbol
    const searchInput = this.page.getByTestId(TEST_IDS.searchInput)
    await searchInput.fill(token.symbol)

    // Ensure we click the token inside the BottomSheet,
    // not the one rendered as the default in the Select menu.
    const tokenLocator = this.page
      .getByTestId(TEST_IDS.bottomSheet)
      .getByTestId(`option-${token.address}.${token.chainId}`)
    await tokenLocator.click()
  }

  async clickOnMenuFeeToken(paidByAddress: string, token: Token, onGasTank?: boolean) {
    const selectMenu = this.page.getByTestId(TEST_IDS.feeTokensSelect)
    await selectMenu.click()

    // If the token is outside the viewport, we ensure it becomes visible by searching for its symbol
    const searchInput = this.page.getByTestId(TEST_IDS.searchInput)
    await searchInput.fill(token.symbol)

    const paidBy = paidByAddress.toLowerCase()
    const tokenAddress = token.address.toLowerCase()
    const tokenSymbol = token.symbol.toLowerCase()
    const gasTank = onGasTank ? 'gastank' : ''

    // Ensure we click the token inside the SelectMenu,
    // not the one rendered as the default value.
    const tokenLocator = this.page
      .getByTestId('select-menu')
      .getByTestId(`option-${paidBy + tokenAddress + tokenSymbol + gasTank}`)
    await tokenLocator.click()
  }

  async typeTextInInputField(locator: string, text: string): Promise<void> {
    await this.page.locator(locator).clear()
    await this.page.locator(locator).pressSequentially(text)
  }
}
