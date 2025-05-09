// FILE: e2e-playwright-tests/pages/basePage.ts

import { Page } from '@playwright/test'

export class BasePage {
  constructor(protected page: Page) {}

  async navigateToHome(page) {
    await page.goto('/')
  }

  async clickOnElement(page, element: string): Promise<void> {
    await page.locator(element).click()
  }

  async typeTextInInputField(page, locator: string, text: string): Promise<void> {
    await page.locator(locator).pressSequentially(text)
  }
}
