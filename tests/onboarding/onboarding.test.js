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

    const href = await page.evaluate(() => window.location.href)
    expect(href).toContain('/get-started')
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })
  it('should pass through the onboarding steps and agree with the terms', async () => {
    // Click on "Next" button several times to finish the onboarding.
    const buttonNext = '[data-testid="stories-button-next"]'

    await page.waitForSelector('[data-testid="selected-bullet-0"]')
    // Check if selected bullet is correct
    await page.$eval('[data-testid="selected-bullet-0"]', (el) =>
      el.classList.contains('r-backgroundColor')
    )
    // Click on "Next" button several times to finish the onboarding
    await page.$eval(buttonNext, (button) => button.click())

    await page.waitForSelector(buttonNext)
    await page.waitForSelector('[data-testid="selected-bullet-1"]')

    await page.$eval('[data-testid="selected-bullet-1"]', (el) =>
      el.classList.contains('r-backgroundColor')
    )
    await page.$eval(buttonNext, (button) => button.click())
    await page.waitForSelector('[data-testid="selected-bullet-2"]')
    await page.$eval('[data-testid="selected-bullet-2"]', (el) =>
      el.classList.contains('r-backgroundColor')
    )

    await page.$eval(buttonNext, (button) => button.click())
    await page.waitForSelector('[data-testid="selected-bullet-3"]')
    await page.$eval('[data-testid="selected-bullet-3"]', (el) =>
      el.classList.contains('r-backgroundColor')
    )

    await page.$eval(buttonNext, (button) => button.click())
    await page.waitForSelector('[data-testid="selected-bullet-4"]')
    await page.$eval('[data-testid="selected-bullet-4"]', (el) =>
      el.classList.contains('r-backgroundColor')
    )

    await page.$eval(buttonNext, (button) => button.click())
    await page.waitForSelector('[data-testid="selected-bullet-5"]')
    await page.$eval('[data-testid="selected-bullet-5"]', (el) =>
      el.classList.contains('r-backgroundColor')
    )

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
