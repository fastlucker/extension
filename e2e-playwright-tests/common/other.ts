import { expect } from '@playwright/test'

import { clickOnElement } from '../common-helpers/clickOnElement'
import { typeText } from '../common-helpers/typeText'
import { constants } from '../constants/constants'
import { SELECTORS } from './selectors/selectors'

export async function addContactInAddressBook(page, extensionURL) {
  await page.goto(`${extensionURL}/tab.html#/settings/address-book`, {
    waitUntil: 'load'
  })

  const addName = 'First Address'
  const addAddress = constants.addresses.smartAccount
  // 0xC254b41be9582...          dD3F8092D4ea6C

  await typeText(page, '[data-testid="contact-name-field"]', addName)
  await typeText(page, SELECTORS.addressEnsField, addAddress)

  await clickOnElement(page, '[data-testid="add-to-address-book-button"]')

  await page.waitForSelector('[data-testid="name-first-address"]')

  const addressContent = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="name-first-address"]')
    return element ? element.outerHTML : ''
  })

  // Ensure the element contains both the name and address
  expect(addressContent).toContain(addName)
  expect(addressContent).toContain(addAddress.substring(addAddress.length - 14))
}
