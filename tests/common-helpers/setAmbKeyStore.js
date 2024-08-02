import { clickOnElement } from './clickOnElement'
import { typeText } from './typeText'

export async function setAmbKeyStore(page, privKeyOrPhraseSelector) {
  const buttonNext = '[data-testid="stories-button-next"]'

  await page.waitForSelector(buttonNext)
  // Click on "Next" button several times to finish the onboarding
  await page.$eval(buttonNext, (button) => button.click())
  await page.waitForSelector('[data-testid="stories-button-previous"]')
  await page.$eval(buttonNext, (button) => button.click())
  await page.$eval(buttonNext, (button) => button.click())
  await page.$eval(buttonNext, (button) => button.click())
  await page.$eval(buttonNext, (button) => button.click())

  // check the checkbox "I agree ..."
  await page.$eval('[data-testid="checkbox"]', (button) => button.click())
  // Click on "Got it"
  await page.$eval(buttonNext, (button) => button.click())

  await page.waitForSelector('[data-testid="get-started-button-import"]')

  // Click on "Import" button
  await page.$eval('[data-testid="get-started-button-import"]', (button) => button.click())

  await page.waitForFunction(() => window.location.href.includes('/import-hot-wallet'))
  // Click on "Import" private key
  await clickOnElement(page, privKeyOrPhraseSelector)

  // type phrase
  const phrase = 'Password'
  await typeText(page, '[data-testid="enter-pass-field"]', phrase)
  await typeText(page, '[data-testid="repeat-pass-field"]', phrase)

  // Click on "Set up Ambire Key Store" button
  await clickOnElement(page, '[data-testid="keystore-button-create"]')
  await clickOnElement(page, '[data-testid="keystore-button-continue"]', true, 1500)
}
