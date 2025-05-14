import { locators } from '@common/locators'

import { bootstrap } from '../common-helpers/bootstrap'
import { DEF_KEYSTORE_PASS } from '../config/constants'
import { BasePage } from './basePage'

export class AuthPage extends BasePage {
  async init() {
    const { page } = await bootstrap('auth')
    this.page = page // Initialize the POM page property with the Playwright page instance
  }

  async setExtensionPassword(): Promise<void> {
    await this.typeTextInInputField(locators.enterPasswordField, DEF_KEYSTORE_PASS)
    await this.typeTextInInputField(locators.repeatPasswordField, DEF_KEYSTORE_PASS)
    await this.clickOnElement(locators.confirmButton)
  }

  async importViewOnlyAccount(account): Promise<void> {
    await this.page.locator(locators.watchAnAddress).click()
    await this.page.locator(locators.viewOnlyInputAddressField).pressSequentially(account)
    await this.page.locator(locators.importViewOnlyButton).click()
    await this.setExtensionPassword()
    await this.page.locator(locators.confirmationMessageForViewOnly).isVisible()
    await this.page.locator(locators.completeButton).click()
    await this.page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await this.page.locator(locators.openDashboardButton).click()
  }

  async verifyRecoveryPhraseScreen(): Promise<void> {
    await this.page.locator(locators.recoveryPhraseHeader).isVisible()
    await this.page.locator(locators.copyRecoveryPhraseButton).click()
    await this.page.getByText('Recovery phrase copied to').isVisible()
    await this.page.locator(locators.savedPhraseButton).click()
  }

  async createNewAccount(): Promise<void> {
    await this.page.locator(locators.createNewAccountButton).click()
    for (let index = 0; index < 3; index++) {
      // eslint-disable-next-line no-await-in-loop
      await this.page.locator(`div[data-testid="checkbox"] >> nth = ${index}`).click()
    }
    await this.page.locator(locators.createRecoveryPhraseButton).click()
    await this.verifyRecoveryPhraseScreen()
    await this.setExtensionPassword()
    await this.page.locator(locators.confirmationMessageForViewOnly).isVisible()
    await this.page.locator(locators.addMoreAccountsButton).isVisible()
    await this.page.locator(locators.completeButton).click()
    await this.page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await this.page.locator(locators.openDashboardButton).click()
  }
}
