// FILE: e2e-playwright-tests/pages/swapAndBridgePage

import { BasePage } from './basePage'

export class SwapAndBridgePage extends BasePage {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async init() {}

  async navigateToHome() {
    await this.page.goto('/')
  }
}
