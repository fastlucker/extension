import { TEST_IDS as selectors } from '@common/selectors/selectors'
import { bootstrapWithStorage } from '@helpers/bootstrap'

import Token from '../interfaces/token'
import { BasePage } from './basePage'

export class GasTankPage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('gasTank', param)
    this.page = page
  }

  async getCurrentBalance() {
    const amountText = await this.page.getByTestId(selectors.fullBalance).innerText()
    const amountNumber = parseFloat(amountText.replace(/[^\d.]/g, ''))

    return amountNumber
  }

  async topUpGasTank(token: Token, amount: string) {
    await this.page.getByTestId(selectors.dashboardGasTankButton).click()
    await this.page.getByTestId(selectors.topUpButton).click()

    await this.clickOnMenuToken(token)

    // Switch to dollar
    await this.page.getByTestId(selectors.flipIcon).click()

     // Amount
     const amountField = this.page.getByTestId(selectors.amountField)
     await amountField.fill(amount)

    await this.page.getByTestId(selectors.topUpProceedButton).click()
  }
}
