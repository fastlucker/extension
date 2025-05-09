// FILE: e2e-playwright-tests/pages/authPage.ts

import 'dotenv/config'

import { locators } from '@common/locators'
import { Page } from '@playwright/test'

import { DEF_KEYSTORE_PASS } from '../config/constants'
import { BasePage } from './basePage'

export class AuthPage extends BasePage {
  constructor(protected page: Page) {
    super(page)
  }

  async setExtensionPassword(page): Promise<void> {
    await this.typeTextInInputField(page, locators.enterPasswordField, DEF_KEYSTORE_PASS)
    await this.typeTextInInputField(page, locators.repeatPasswordField, DEF_KEYSTORE_PASS)
    await this.clickOnElement(page, locators.confirmButton)
  }

  async importViewOnlyAccount(page, account): Promise<void> {
    await page.locator(locators.watchAnAddress).click()
    await page.locator(locators.viewOnlyInputAddressField).pressSequentially(account)
    await page.locator(locators.importViewOnlyButton).click()
    await this.setExtensionPassword(page)
    await page.locator(locators.confirmationMessageForViewOnly).isVisible()
    await page.locator(locators.completeButton).click()
    await page.locator(locators.confirmationMessageAmbireWallet).isVisible()
    await page.locator(locators.openDashboardButton).click()
  }
}
