// FILE: e2e-playwright-tests/pages/swapAndBridgePage

import { Page } from '@playwright/test'

import { BasePage } from './basePage'

export class SwapAndBridgePage extends BasePage {
  constructor(protected page: Page) {
    super(page)
  }

  async navigateToHome() {
    await this.page.goto('/')
  }
}
