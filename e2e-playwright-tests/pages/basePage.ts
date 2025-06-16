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
    await this.page.waitForLoadState()
    await this.page.locator(element).nth(0).click()
  }

  async clickOnMenuToken(token: Token, menuSelector: string = TEST_IDS.tokensSelect) {
    const menu = this.page.getByTestId(menuSelector)
    await menu.click()

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

  async handleNewPage(locator: string) {
    // TODO: this was old solution, remove it if new one works
    // const context = this.page.context()
    // const [newPage] = await Promise.all([
    //   context.waitForEvent('page'),
    //   this.page.getByTestId(locator).first().click({ timeout: 3000 })
    // ])
    // await newPage.waitForLoadState()
    // return newPage

    const context = this.page.context()
    const actionWindowPagePromise = new Promise<Page>((resolve) => {
      context.once('page', (p) => {
        resolve(p)
      })
    })

    await this.page.getByTestId(locator).first().click({ timeout: 3000 })
    return actionWindowPagePromise
  }

  async pause() {
    await this.page.pause()
  }
}
