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
import { Page } from '@playwright/test'

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

  private initializePages(page: Page): void {
    this.basePage = new BasePage(page)
    this.authPage = new AuthPage(page)
    this.settingsPage = new SettingsPage(page)
    this.gasTankPage = new GasTankPage(page)
    this.signMessagePage = new SignMessagePage(page)
    this.dashboardPage = new DashboardPage(page)
    this.swapAndBridgePage = new SwapAndBridgePage(page)
    this.stabilityPage = new StabilityPage(page)
    this.transferPage = new TransferPage(page)
  }

  async initWithStorage(param?: any): Promise<void> {
    const { page } = await bootstrapWithStorage('', param)
    this.initializePages(page)
  }

  async initWithoutStorage(): Promise<void> {
    const { page } = await bootstrap('')
    this.initializePages(page)
  }
}

export const pages = new PageManager()
