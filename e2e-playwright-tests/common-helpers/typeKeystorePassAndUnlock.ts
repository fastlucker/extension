
import { SELECTORS } from '../common/selectors/selectors'
import { clickOnElement } from './clickOnElement'
import { typeText } from './typeText'

// TODO: this method should be deprecarted
export async function typeKeystorePassAndUnlock(page, password) {
  await page.waitForSelector(SELECTORS.passphraseField)
  // await typeText(page, SELECTORS.passphraseField, password)
  // await clickOnElement(page, SELECTORS.buttonUnlock) // Click on "Unlock button"
  // await page.waitForSelector(SELECTORS.fullBalance)
  await page.getByTestId(SELECTORS.passphraseField).fill(password)
  await page.getByTestId(SELECTORS.buttonUnlock).click()
}
