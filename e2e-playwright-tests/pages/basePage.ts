import { Page } from '@playwright/test'

export abstract class BasePage {
  page: Page

  abstract init(param?): Promise<void> // ⛔ Must be implemented in subclasses

  async navigateToHome() {
    await this.page.goto('/')
  }

  async clickOnElement(element: string): Promise<void> {
    await this.page.waitForLoadState()
    await this.page.locator(element).nth(0).click()
  }

  async typeTextInInputField(locator: string, text: string): Promise<void> {
    await this.page.locator(locator).clear()
    await this.page.locator(locator).pressSequentially(text)
  }

  async handleNewPage(locator: string) {
    const context = this.page.context()
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      this.page.locator(locator).first().click({ timeout: 3000 })
    ])
    await newPage.waitForLoadState()
    return newPage
  }

  async pause() {
    await this.page.pause()
  }
}
