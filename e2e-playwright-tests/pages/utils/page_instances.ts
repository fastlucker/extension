import BootstrapContext from 'interfaces/bootstrapContext'
import { AuthPage } from 'pages/authPage'
import { BasePage } from 'pages/basePage'
import { DashboardPage } from 'pages/dashboardPage'
import { GasTankPage } from 'pages/gasTankPage'
import { SettingsPage } from 'pages/settingsPage'
import { SignMessagePage } from 'pages/signMessagePage'
import { StabilityPage } from 'pages/stabilityPage'
import { SwapAndBridgePage } from 'pages/swapAndBridgePage'
import { TransferPage } from 'pages/transferPage'

import { bootstrap, bootstrapWithStorage } from '@helpers/bootstrap'

export class PageManager {
  basePage: BasePage

  authPage: AuthPage

  gasTankPage: GasTankPage

  dashboardPage: DashboardPage

  settingsPage: SettingsPage

  signMessagePage: SignMessagePage

  swapAndBridgePage: SwapAndBridgePage

  stabilityPage: StabilityPage

  transferPage: TransferPage

  private initializePages(bootstrapContext: BootstrapContext): void {
    this.basePage = new BasePage(bootstrapContext)
    this.authPage = new AuthPage(bootstrapContext)
    this.settingsPage = new SettingsPage(bootstrapContext)
    this.gasTankPage = new GasTankPage(bootstrapContext)
    this.signMessagePage = new SignMessagePage(bootstrapContext)
    this.dashboardPage = new DashboardPage(bootstrapContext)
    this.swapAndBridgePage = new SwapAndBridgePage(bootstrapContext)
    this.transferPage = new TransferPage(bootstrapContext)
    this.stabilityPage = new StabilityPage(bootstrapContext)
  }

  async initWithStorage(param: any): Promise<void> {
    const { page, context, serviceWorker, extensionURL } = await bootstrapWithStorage('', param)

    const bootstrapContext = { page, context, serviceWorker, extensionURL }

    this.initializePages(bootstrapContext)
  }

  async initWithoutStorage(): Promise<void> {
    const { page, context } = await bootstrap('')

    const bootstrapContext = {
      page,
      context,
      serviceWorker: undefined,
      extensionURL: undefined
    }

    this.initializePages(bootstrapContext)
  }
}
