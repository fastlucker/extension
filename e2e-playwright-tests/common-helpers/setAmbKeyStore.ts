import { clickOnElement } from './clickOnElement'
import { completeOnboardingSteps } from './completeOnboardingSteps'
import { typeText } from './typeText'
import { SELECTORS } from '../common/selectors/selectors'

export async function setAmbKeyStore(page, privKeyOrPhraseSelector, flow = 'seed') {
  await completeOnboardingSteps(page)

  await page.waitForFunction(() => window.location.href.includes('/get-started'))
  // Click on "Import" button
  await clickOnElement(page, SELECTORS.getStartedBtnImport)

  await page.waitForFunction(() => window.location.href.includes('/import-hot-wallet'))

  // Click on Seed Phrase "Proceed" button
  await clickOnElement(page, privKeyOrPhraseSelector)

  if (flow === 'seed') {
    // Click on "Import existing seed" button in "Create or import Seed Phrase" modal
    // Note: Added delay of 500ms because of modal
    await clickOnElement(page, SELECTORS.importExistingSeedBtn, true, 500)
  } else if (flow === 'privateKey') {
    await clickOnElement(page, SELECTORS.privateKeyWarningCheckbox1, false, 500)
    await clickOnElement(page, SELECTORS.privateKeyWarningCheckbox2)
    await clickOnElement(page, SELECTORS.proceedBtn, true)
  }

  await page.waitForFunction(() => window.location.href.includes('/keystore-setup'))

  // type phrase
  const phrase = 'Password'
  await typeText(page, SELECTORS.enterPassField, phrase)
  await typeText(page, SELECTORS.repeatPassField, phrase)

  // Click on "Set up Ambire Key Store" button
  await clickOnElement(page, SELECTORS.keystoreBtnCreate)
  await clickOnElement(page, SELECTORS.keystoreBtnContinue, true, 1500)
}
