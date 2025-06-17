import { TEST_IDS } from '@common/selectors/selectors'
import { expect } from '@playwright/test'
import { bootstrapWithStorage } from 'common-helpers/bootstrap'
import { BasePage } from './basePage'
import { baParams } from 'constants/env'
import Token from 'interfaces/token'

export class TransferPage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('transfer', param)
    this.page = page
  }

  async navigateToTransfer() {
    const sendButton = this.page.getByTestId(TEST_IDS.dashboardButtonSend)
    await sendButton.click()
  }

  async fillRecipient(address: string) {
    const addressField = this.page.getByTestId(TEST_IDS.addressEnsField)
    await addressField.fill(address)
    const checkbox = this.page.getByTestId(TEST_IDS.recipientAddressUnknownCheckbox)
    await checkbox.click()
  }

  async fillForm(token: Token, recipientAddress: string) {
    // Choose token
    await this.clickOnMenuToken(token)

    // Amount
    const amountField = this.page.getByTestId(TEST_IDS.amountField)
    await amountField.fill('0.001')

    // Address
    await this.fillRecipient(recipientAddress)
  }

  async signAndValidate(feeToken: Token, payWithGasTank?: boolean) {
    // Proceed
    const proceedButton = this.page.getByTestId(TEST_IDS.proceedBtn)
    await proceedButton.click()

    // Select Fee token and payer
    await this.clickOnMenuFeeToken(baParams.envSelectedAccount, feeToken, payWithGasTank)

    // Sign & Broadcast
    const sign = this.page.getByTestId(TEST_IDS.signButton)
    await sign.click()

    // Validate
    const txnStatus = await this.page.getByTestId(TEST_IDS.txnStatus).textContent()
    expect(txnStatus).toEqual('Transfer done!')
  }

  async send(token: Token, recipientAddress: string, feeToken: Token, payWithGasTank?: boolean) {
    await this.navigateToTransfer()
    await this.fillForm(token, recipientAddress)
    await this.signAndValidate(feeToken, payWithGasTank)
  }

  async addToBatch() {
    const batchButton = this.page.getByTestId(TEST_IDS.batchBtn)
    await batchButton.click()

    const gotIt = this.page.getByTestId(TEST_IDS.batchModalGotIt)
    await gotIt.click()
  }
}
