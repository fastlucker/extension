import { locators } from '@common/locators'

import { bootstrap } from '../common-helpers/bootstrap'
import { BA_PRIVATE_KEY, DEF_KEYSTORE_PASS } from '../config/constants'
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

  async importExistingAccount(): Promise<void> {
    await this.page.locator(locators.importExistingAccountButton).click()
    await this.page.locator(locators.importFromPrivateKeyButton).click()
    await this.typeTextInInputField(locators.inputPrivateKey, BA_PRIVATE_KEY)
    await this.page.locator(locators.warningCheckbox).click()
    await this.page.locator(locators.importConfirmButton).click()
    await this.setExtensionPassword()
    await this.page.locator(locators.confirmationMessageForViewOnly).isVisible()
    await this.page.locator(locators.addMoreAccountsButton).isVisible()
    await this.page.locator(locators.completeButton).click()
    await this.page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await this.page.locator(locators.openDashboardButton).click()
  }

  async importExistingAccountByRecoveryPhrase(passphrase: string): Promise<void> {
    await this.page.locator(locators.importExistingAccountButton).click()
    await this.page.locator(locators.importFromRecoveryPhraseButton).click()
    await this.typeTextInInputField(locators.inputSeetField, passphrase)
    await this.page.locator(locators.recoveryPhraseAdvancedModeToggle).isVisible()
    await this.page.locator(locators.recoveryPhraseAdvancedModeToggle).click()
    await this.typeTextInInputField(locators.inputPassphrase, passphrase)
    await this.page.locator(locators.importConfirmButton).click()
    await this.setExtensionPassword()
    await this.personalizeAccountName()
    await this.page.locator(locators.addMoreAccountsButton).isVisible()
    await this.page.locator(locators.completeButton).click()
    await this.page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await this.page.locator(locators.openDashboardButton).click()
  }

  async personalizeAccountName(): Promise<void> {
    await this.page.locator(locators.editAccountButton).click()
    // TODO: Parametrization
    await this.typeTextInInputField(locators.editAccountNameField, 'Name 1')
    await this.page.locator(locators.saveMessageText).isVisible()
  }

  async importCoupleOfViewOnlyAccount(account1: string, account2: string): Promise<void> {
    await this.page.locator(locators.watchAnAddress).click()
    await this.page.locator(locators.viewOnlyInputAddressField).pressSequentially(account1)
    await this.page.locator(locators.addMoreAdressesButton).click()
    await this.page.locator(locators.viewOnlySecondInputAddressField).pressSequentially(account2)
    await this.page.locator(locators.importViewOnlyButton).click()
    await this.setExtensionPassword()
    await this.page.locator(locators.confirmationMessageForViewOnly).isVisible()
    await this.personalizeAccountName()
    await this.page.locator(locators.completeButton).click()
    await this.page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await this.page.locator(locators.openDashboardButton).click()
  }

  async createNewHotWalletAndPersonalizeName(): Promise<void> {
    await this.page.locator(locators.createNewAccountButton).click()
    for (let index = 0; index < 3; index++) {
      // eslint-disable-next-line no-await-in-loop
      await this.page.locator(`div[data-testid="checkbox"] >> nth = ${index}`).click()
    }
    await this.page.locator(locators.createRecoveryPhraseButton).click()
    await this.verifyRecoveryPhraseScreen()
    await this.setExtensionPassword()
    await this.page.locator(locators.addMoreAccountsButton).click()
    await this.page.locator(locators.smartAccountPicker).click()
    await this.page.locator(locators.importAccountButton).click()
    await this.page.locator(locators.confirmationMessageForViewOnly).isVisible()
    await this.personalizeAccountName()
    await this.page.locator(locators.addMoreAccountsButton).isVisible()
    await this.page.locator(locators.completeButton).click()
    await this.page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await this.page.locator(locators.openDashboardButton).click()
  }
}
