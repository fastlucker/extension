import { test as testBase } from '@playwright/test'

import { DashboardPage } from 'pages/dashboardPage'
import { TransferPage } from 'pages/transferPage'
import { AuthPage } from 'pages/authPage'
import { SwapAndBridgePage } from 'pages/swapAndBridgePage'
import { SignMessagePage } from 'pages/signMessagePage'

type PageObjects = {
  authPage: AuthPage
  swapAndBridgePage: SwapAndBridgePage
  dashboardPage: DashboardPage
  transferPage: TransferPage
  signMessagePage: SignMessagePage
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
  signMessagePage: async ({}, use) => {
    await use(new SignMessagePage())
  }
})
