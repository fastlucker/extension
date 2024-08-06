import { clickOnElement } from '../common-helpers/clickOnElement'
import { bootstrap } from '../common-helpers/bootstrap'
import { INVITE_STORAGE_ITEM } from '../constants/constants.js'

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
    await clickOnElement(page, '[data-testid="stories-button-next-0"]')

    await page.waitForSelector('[data-testid="stories-button-next-1"]')
    await page.$eval('[data-testid="stories-button-next-1"]', (button) => button.click())

    await page.waitForSelector('[data-testid="stories-button-next-2"]')
    await page.$eval('[data-testid="stories-button-next-2"]', (button) => button.click())

    await page.waitForSelector('[data-testid="stories-button-next-3"]')
    await page.$eval('[data-testid="stories-button-next-3"]', (button) => button.click())

    await page.waitForSelector('[data-testid="stories-button-next-4"]')
    await page.$eval('[data-testid="stories-button-next-4"]', (button) => button.click())

    // check the checkbox "I agree ..."
    await page.$eval('[data-testid="checkbox"]', (button) => button.click())
    // Click on "Got it"

    await page.waitForSelector('[data-testid="stories-button-next-5"]')
    await page.$eval('[data-testid="stories-button-next-5"]', (button) => button.click())

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    await page.waitForSelector('[data-testid="get-started-button-import"]')

    // Check for the text "Welcome to Ambire Wallet" on the page
    const textExists = await page.evaluate(() => {
      return document.body.innerText.includes('Welcome to Ambire Wallet')
    })

    expect(textExists).toBe(true)
  })
})
