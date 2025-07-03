import { bootstrapWithStorage } from 'common-helpers/bootstrap'
import { baParams } from 'constants/env'
import selectors from 'constants/selectors'
import Token from 'interfaces/token'

import { expect } from '@playwright/test'

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

  async fillAmount(token: Token) {
    await this.clickOnMenuToken(token)
    // Amount
    await this.page.waitForTimeout(1000) // without pause it misses the amount field and continues on
    await this.entertext(selectors.amountField, '0.001')
  }

  async fillRecipient(address: string) {
    await this.entertext(selectors.addressEnsField, address)
  }

  async fillForm(token: Token, recipientAddress: string) {
    // Choose token
    await this.fillAmount(token)
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

  async send(
    token: Token,
    recipientAddress: string,
    feeToken: Token,
    payWithGasTank?: boolean,
    isUnknownAddress: boolean = true
  ) {
    await this.navigateToTransfer()
    await this.fillForm(token, recipientAddress)

    // if address is unknown checkbox has to be checked
    if (isUnknownAddress) {
      await this.click(selectors.recipientAddressUnknownCheckbox)
    }

    await this.signAndValidate(feeToken, payWithGasTank)
  }

  async addToBatch() {
    await this.click(selectors.batchBtn)
    await this.click(selectors.batchModalGotIt)
  }

  async addUnknownRecepientToAddressBook(recepientAddress: string, contactName: string) {
    await this.fillRecipient(recepientAddress)

    // open Add new contact form
    const addNewContactModal = await this.isVisible(selectors.formAddContactNameField)
    // work around; sometimes the one click does not open the modal
    if (!addNewContactModal) {
      await this.click(selectors.sendFormAddToAddresBook)
    }

    // add new contact
    await this.page.waitForTimeout(500)
    await this.entertext(selectors.formAddContactNameField, contactName)
    await this.click(selectors.formAddToContactsButton)

    // assert snackbar notification
    await expect(this.page.locator(selectors.contactSuccessfullyAddedSnackbar)).toHaveText(
      'Contact added to Address Book'
    )

    // confirm new contact as recepient
    const newContactAddressOption = 'option-0xc254b41be9582e45a2ace62d5add3f8092d4ea6c'
    await this.click(newContactAddressOption)
    await this.page.waitForTimeout(1000) // waiting animation
  }
}
