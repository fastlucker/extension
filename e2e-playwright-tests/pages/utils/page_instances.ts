import { AuthPage } from 'pages/authPage'
import { BasePage } from 'pages/basePage'
import { DashboardPage } from 'pages/dashboardPage'
import { SwapAndBridgePage } from 'pages/swapAndBridgePage'

import { bootstrap, bootstrapWithStorage } from '@helpers/bootstrap'
import { Page } from '@playwright/test'

export class PageManager {
  basePage: BasePage

  authPage: AuthPage

  dashboardPage: DashboardPage

  swapAndBridgePage: SwapAndBridgePage

  private initializePages(page: Page): void {
    this.basePage = new BasePage(page)
    this.authPage = new AuthPage(page)
    this.dashboardPage = new DashboardPage(page)
    this.swapAndBridgePage = new SwapAndBridgePage(page)
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
