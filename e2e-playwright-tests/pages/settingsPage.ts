import { KEYSTORE_PASS, NETWORKS_LIST } from 'constants/env'
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
    await this.page.pause()

    await this.page.locator('//div[contains(text(),"Network")]').first().click()
    await this.checkUrl('/settings/networks')
    // await selectSetting(page, 'Network', 'Network details')

    await this.click(selectors.settingsAddNetworkManually)

    const network = NETWORKS_LIST[network_symbol]
    // await typeNetworkField(page, 'Network name', network.networkName)
    // await typeNetworkField(page, 'Currency Symbol', network.ccySymbol)
    // await typeNetworkField(page, 'Currency Name', network.ccyName)
    // await typeNetworkField(page, 'RPC URL', network.rpcUrl)

    await this.entertext('Network name', network.networkName)
    await this.entertext('Currency Symbol', network.ccySymbol)
    await this.entertext('Currency Name', network.ccyName)
    await this.entertext('RPC URL', network.rpcUrl)

    const [addButton] = await page.$x(MANUAL_ADD_BTN)
    await addButton.click()
    await typeNetworkField(page, 'Block Explorer URL', network.explorerUrl)
    await page.waitForXPath(AMBIRE_SMART_ACCOUNTS_MSG, { hidden: true, timeout: 9000 })
    await selectManualNetworkButton(page, 'Add network', 1000)

    await verifyGreenMessage(page, GREEN_MSG_NETWORK_ADDED)
  }

  async typeNetworkField(field: string, text: string) {
    const xpath = `//div[text()="${field}"]/following-sibling::div//input`
    await this.page.waitForXPath(xpath, { visible: true, timeout: 3000 })
    const [inputElement] = await page.$x(xpath)
    await inputElement.type(text)
  }
}
