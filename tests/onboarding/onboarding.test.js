import { bootstrap } from '../common-helpers/bootstrap'
import { INVITE_STORAGE_ITEM } from '../common-helpers/constants'

describe('Onboarding', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  beforeEach(async () => {
    ;({ browser, extensionURL, serviceWorker, recorder, page } = await bootstrap('onboarding'))
    // Bypass the invite verification step
    await serviceWorker.evaluate(
      (invite) => chrome.storage.local.set({ invite, isE2EStorageSet: true }),
      JSON.stringify(INVITE_STORAGE_ITEM)
    )

    const getStartedPage = `${extensionURL}/tab.html#/get-started`
    await page.goto(getStartedPage)
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })
  it('should pass through the onboarding steps and agree with the terms', async () => {
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

    // Check for the text "Welcome to Ambire Wallet" on the page
    const textExists = await page.evaluate(() => {
      return document.body.innerText.includes('Welcome to Ambire Wallet')
    })

    expect(textExists).toBe(true)
  })
})
