import { DashboardPage } from 'pages/dashboardPage'

import { test as testBase } from '@playwright/test'

import { AuthPage } from '../pages/authPage'
import { SwapAndBridgePage } from '../pages/swapAndBridgePage'

type PageObjects = {
  authPage: AuthPage
  swapAndBridgePage: SwapAndBridgePage
  dashboardPage: DashboardPage
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
  }
})
