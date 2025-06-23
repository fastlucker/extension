import { DEF_KEYSTORE_PASS, NEW_KEYSTORE_PASSWORD } from 'constants/env'
import selectors from 'constants/selectors'

import { bootstrapWithStorage } from '@helpers/bootstrap'

import { BasePage } from './basePage'

export class SettingsPage extends BasePage {
  async init(param): Promise<void> {
    const { page } = await bootstrapWithStorage('keystore', param)
    this.page = page
  }

  async openSettingsGeneral() {
    await this.click(selectors.dashboardHumburgerBtn)
    await this.checkUrl('/settings/general')
  }

  async lockKeystore(): Promise<void> {
    await this.openSettingsGeneral()

    await this.expectButtonVisible(selectors.lockExtensionButton)
    await this.click(selectors.lockExtensionButton)

    await this.checkUrl('/tab.html#/keystore-unlock')
  }

  async unlockKeystore(): Promise<void> {
    await this.openSettingsGeneral()

    await this.checkUrl('/tab.html#/keystore-unlock')
    
    await this.click(selectors.lockExtensionButton)

    await this.entertext(selectors.passphraseField, DEF_KEYSTORE_PASS)
    await this.click(selectors.buttonUnlock)
    await this.expectButtonVisible(selectors.fullBalance)
  }

  async openExtensionPassword() {
    await this.openSettingsGeneral()
    // await this.click(selectors.lockExtensionButton) // TODO: change to id once we have it on FE
    await this.page.locator('//div[contains(text(),"Extension password")]').first().click()
    await this.checkUrl('/settings/device-password-change')
  }

  async changeKeystorePassword(currPass: string, newPass: string): Promise<void> {
    await this.entertext(selectors.enterCurrentPassField, currPass)
    await this.entertext(selectors.enterNewPassField, newPass)
    await this.entertext(selectors.repeatNewPassField, newPass)
    await this.click(selectors.changeDevicePassButton)
    // close success modal
    await this.click(selectors.devicePassSuccessModal)
  }
}
