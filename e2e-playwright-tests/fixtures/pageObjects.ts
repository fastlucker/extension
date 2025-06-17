import { DashboardPage } from 'pages/dashboardPage'
import { GasTankPage } from 'pages/gasTankPage'
import { TransferPage } from 'pages/transferPage'

import { test as testBase } from '@playwright/test'

import { AuthPage } from '../pages/authPage'
import { SwapAndBridgePage } from '../pages/swapAndBridgePage'

type PageObjects = {
  authPage: AuthPage
  swapAndBridgePage: SwapAndBridgePage
  dashboardPage: DashboardPage
  transferPage: TransferPage
  gasTankPage: GasTankPage
}

export const test = testBase.extend<PageObjects>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage())
  },
  swapAndBridgePage: async ({ page }, use) => {
    await use(new SwapAndBridgePage())
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage())
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferPage())
  },
  gasTankPage: async ({page}, use) => {
    await use(new GasTankPage())
  }
})
