import { clickOnElement } from './clickOnElement'
import { typeText } from './typeText'

export async function typeSeedPhrase(page, seedPhrase) {
  await page.waitForSelector('[data-testid="passphrase-field"]')
  await typeText(page, '[data-testid="passphrase-field"]', seedPhrase)
  await clickOnElement(page, '[data-testid="button-unlock"]') // Click on "Unlock button"
  await page.waitForSelector('[data-testid="full-balance"]')
}
