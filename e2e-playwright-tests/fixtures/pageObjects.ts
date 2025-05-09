import { test as testBase } from '@playwright/test'

import { AuthPage } from '../pages/authPage'
import { SwapAndBridgePage } from '../pages/swapAndBridgePage'

type PageObjects = {
  authPage: AuthPage
  swapAndBridgePage: SwapAndBridgePage
}

export const test = testBase.extend<PageObjects>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page))
  },
  swapAndBridgePage: async ({ page }, use) => {
    await use(new SwapAndBridgePage(page))
  }
})
