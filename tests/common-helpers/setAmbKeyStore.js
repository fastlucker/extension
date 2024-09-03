import { clickOnElement } from './clickOnElement'
import { completeOnboardingSteps } from './completeOnboardingSteps'
import { typeText } from './typeText'
import { buildSelector } from './buildSelector'
import {
  TEST_ID_GET_STARTED_BTN_IMPORT,
  TEST_ID_ENTER_PASS_FIELD,
  TEST_ID_REPEAT_PASS_FIELD,
  TEST_ID_KEYSTORE_BTN_CREATE,
  TEST_ID_KEYSTORE_BTN_CONTINUE
} from '../common/constants/common'

export async function setAmbKeyStore(page, privKeyOrPhraseSelector) {
  const getStartedBtnImportSelector = buildSelector(TEST_ID_GET_STARTED_BTN_IMPORT)
  const enterPassFieldSelector = buildSelector(TEST_ID_ENTER_PASS_FIELD)
  const repeatPassFieldSelector = buildSelector(TEST_ID_REPEAT_PASS_FIELD)
  const keystoreBtnCreateSelector = buildSelector(TEST_ID_KEYSTORE_BTN_CREATE)
  const keystoreBtnContinueSelector = buildSelector(TEST_ID_KEYSTORE_BTN_CONTINUE)

  await completeOnboardingSteps(page)

  await page.waitForFunction(() => window.location.href.includes('/get-started'))
  // Click on "Import" button
  await clickOnElement(page, getStartedBtnImportSelector)

  await page.waitForFunction(() => window.location.href.includes('/import-hot-wallet'))
  // Click on "Import" private key
  await clickOnElement(page, privKeyOrPhraseSelector)
  await page.waitForFunction(() => window.location.href.includes('/keystore-setup'))
  // type phrase
  const phrase = 'Password'
  await typeText(page, enterPassFieldSelector, phrase)
  await typeText(page, repeatPassFieldSelector, phrase)

  // Click on "Set up Ambire Key Store" button
  await clickOnElement(page, keystoreBtnCreateSelector)
  await clickOnElement(page, keystoreBtnContinueSelector, true, 1500)
}
