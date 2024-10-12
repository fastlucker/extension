import { clickOnElement } from './clickOnElement'
import { completeOnboardingSteps } from './completeOnboardingSteps'
import { typeText } from './typeText'
import { SELECTORS } from '../common/selectors/selectors'

export async function setAmbKeyStore(page, privKeyOrPhraseSelector) {
  await completeOnboardingSteps(page)

  await page.waitForFunction(() => window.location.href.includes('/get-started'))
  // Click on "Import" button
  await clickOnElement(page, SELECTORS.getStartedBtnImport)

  await page.waitForFunction(() => window.location.href.includes('/import-hot-wallet'))
  // Click on "Import" private key
  await clickOnElement(page, privKeyOrPhraseSelector)
  await page.waitForFunction(() => window.location.href.includes('/keystore-setup'))
  // type phrase
  const phrase = 'Password'
  await typeText(page, SELECTORS.enterPassField, phrase)
  await typeText(page, SELECTORS.repeatPassField, phrase)

  // Click on "Set up Ambire Key Store" button
  await clickOnElement(page, SELECTORS.keystoreBtnCreate)
  await clickOnElement(page, SELECTORS.keystoreBtnContinue, true, 1500)
}
