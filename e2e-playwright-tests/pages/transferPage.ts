import { bootstrapWithStorage } from 'common-helpers/bootstrap'
import { baParams } from 'constants/env'
import selectors from 'constants/selectors'
import Token from 'interfaces/token'

import { BasePage } from './basePage'

export class TransferPage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('transfer', param)
    this.page = page
  }

  async navigateToTransfer() {
    await this.click(selectors.dashboardButtonSend)
  }

  async openAddressBookPage() {
    await this.click(selectors.dashboardHumburgerBtn)

    // go to Address book page and assert url
    await this.page.locator('//div[contains(text(),"Address Book")]').first().click()
    await this.checkUrl('/settings/address-book')
  }

  async fillRecipient(address: string) {
    await this.entertext(selectors.addressEnsField, address)
    await this.click(selectors.recipientAddressUnknownCheckbox)
  }

  async fillForm(token: Token, recipientAddress: string) {
    // Choose token
    await this.clickOnMenuToken(token)

    // Amount
    await this.entertext(selectors.amountField, '0,001')

    // Address
    await this.fillRecipient(recipientAddress)
  }

  async signAndValidate(feeToken: Token, payWithGasTank?: boolean) {
    // Proceed
    await this.click(selectors.proceedBtn)

    // Select Fee token and payer
    await this.clickOnMenuFeeToken(baParams.envSelectedAccount, feeToken, payWithGasTank)

    // Sign & Broadcast
    await this.click(selectors.signButton)

    // Validate
    await this.compareText(selectors.txnStatus, 'Transfer done!')
  }

  async send(token: Token, recipientAddress: string, feeToken: Token, payWithGasTank?: boolean) {
    await this.navigateToTransfer()
    await this.fillForm(token, recipientAddress)
    await this.signAndValidate(feeToken, payWithGasTank)
  }

  async addToBatch() {
    await this.click(selectors.batchBtn)
    await this.click(selectors.batchModalGotIt)

  }
}
