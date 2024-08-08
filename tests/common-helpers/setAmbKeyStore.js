import { clickOnElement } from './clickOnElement'
import { typeText } from './typeText'

export async function setAmbKeyStore(page, privKeyOrPhraseSelector) {
  // Click on "Next" button several times to finish the onboarding.
  await clickOnElement(page, '[data-testid="stories-button-next-0"]')
  await clickOnElement(page, '[data-testid="stories-button-next-1"]')
  await clickOnElement(page, '[data-testid="stories-button-next-2"]')
  await clickOnElement(page, '[data-testid="stories-button-next-3"]')
  await clickOnElement(page, '[data-testid="stories-button-next-4"]')

  // check the checkbox "I agree ..."
  await page.$eval('[data-testid="checkbox"]', (button) => button.click())

  // Click on "Got it"
  await clickOnElement(page, '[data-testid="stories-button-next-5"]')

  await page.waitForFunction(() => window.location.href.includes('/get-started'))
  // Click on "Import" button
  await clickOnElement(page, '[data-testid="get-started-button-import"]')

  await page.waitForFunction(() => window.location.href.includes('/import-hot-wallet'))
  // Click on "Import" private key
  await clickOnElement(page, privKeyOrPhraseSelector)
  await page.waitForFunction(() => window.location.href.includes('/keystore-setup'))
  // type phrase
  const phrase = 'Password'
  await typeText(page, '[data-testid="enter-pass-field"]', phrase)
  await typeText(page, '[data-testid="repeat-pass-field"]', phrase)

  // Click on "Set up Ambire Key Store" button
  await clickOnElement(page, '[data-testid="keystore-button-create"]')
  await clickOnElement(page, '[data-testid="keystore-button-continue"]', true, 1500)
}
