import { clickOnElement } from './clickOnElement'
import { completeOnboardingSteps } from './completeOnboardingSteps'
import { typeText } from './typeText'

export async function setAmbKeyStore(page, privKeyOrPhraseSelector) {
  await completeOnboardingSteps(page)

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
