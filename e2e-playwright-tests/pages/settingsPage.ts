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

  async openNetworkPage() {
    await this.openSettingsGeneral()

    // go to Network page and assert url
    await this.page.locator('//div[contains(text(),"Network")]').first().click()
    await this.checkUrl('/settings/networks')
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

  async addNetworkManually(networkSymbol: string) {
    // go to network page
    await this.openNetworkPage()

    // add network manually
    await this.click(selectors.settingsAddNetworkManually)

    const network = networks[networkSymbol]
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

  async addNetworkFromChainlist(networkSymbol: string) {
    await this.openNetworkPage()

    const network = networks[networkSymbol]

    await this.page.pause()
    // open chainlist page
    // TODO change once we have ID on FE
    const addNetworkFromChainlist = this.page.getByTestId(selectors.settingsAddNetworkFromChainlist)
    const chainlistTab = await this.handleNewPage(addNetworkFromChainlist)

    // open connect page
    const connectWalletButton = chainlistTab.locator('//button[contains(text(),"Connect Wallet")]') // there are multiple Connect wallet buttons on page
    const connectPage = await this.handleNewPage(connectWalletButton)

    // confirm conection request
    await connectPage.getByTestId(selectors.dappConnectButton).click()

    await chainlistTab.waitForSelector(selectors.chainlistSearchPlaceholder)
    await chainlistTab.locator(selectors.chainlistSearchPlaceholder).fill(network.networkName)

    // add to metamask
    const addNetworkPage = await this.handleNewPage(chainlistTab.locator(selectors.addToMetamaskButton))
    await addNetworkPage.locator(selectors.confirmaddNetworkOnChainlistButton).click()

    // close chainlist tab
    chainlistTab.waitForSelector(selectors.chainlistSearchPlaceholder)
    chainlistTab.close()

    // verify network added
    await this.verifyNetworkAdded(networkSymbol)
  }

  async verifyNetworkAdded(networkSymbol: string) {
    await this.entertext(selectors.searchInput, networkSymbol)

    // select FLOW option
    await this.page.locator('//div[contains(text(),"Flow EVM Mainnet")]').click()

    // assert button is enabled
    await this.page.getByTestId(selectors.disableNetworkButton).isDisabled()
  }
}
