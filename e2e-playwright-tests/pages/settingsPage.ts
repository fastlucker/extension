import { KEYSTORE_PASS } from 'constants/env'
import { networks } from 'constants/networks'
import selectors from 'constants/selectors'

import { bootstrapWithStorage } from '@helpers/bootstrap'
import { expect } from '@playwright/test'

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

    await this.click(selectors.lockExtensionButton)
    await this.checkUrl('/tab.html#/keystore-unlock')

    await this.entertext(selectors.passphraseField, KEYSTORE_PASS)
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

  async addNetworkManually(network_symbol) {
    await this.openSettingsGeneral()

    // go to Network page
    await this.page.locator('//div[contains(text(),"Network")]').first().click()
    await this.checkUrl('/settings/networks')

    // add network manually
    await this.click(selectors.settingsAddNetworkManually)

    const network = networks[network_symbol]
    await this.typeNetworkField('Network name', network.networkName)
    await this.typeNetworkField('Currency Symbol', network.ccySymbol)
    await this.typeNetworkField('Currency Name', network.ccyName)
    await this.typeNetworkField('RPC URL', network.rpcUrl)

    // confirm adding rpc url
    await this.page.locator(selectors.addRPCURLButton).click()
    await this.typeNetworkField('Block Explorer URL', network.explorerUrl)

    // add network
    await this.page.locator(selectors.addNetworkButton).click({ timeout: 5000 })
    await expect(this.page.locator(selectors.networkSuccessfullyAdded)).toHaveText(
      'Network successfully added!'
    )
  }

  // TODO: once have IDs on FE remove this method and use .fill() instead
  async typeNetworkField(field: string, text: string) {
    const selector = `//div[text()="${field}"]/following-sibling::div//input`
    await this.page.waitForSelector(selector, { state: 'visible', timeout: 3000 })
    await this.page.locator(selector).fill(text)
  }
}
