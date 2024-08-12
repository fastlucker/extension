import { INVITE_STORAGE_ITEM } from '../constants/constants'
import { bootstrap } from '../common-helpers/bootstrap'
import { clickOnElement } from '../common-helpers/clickOnElement'
import { typeText } from '../common-helpers/typeText'
import { finishStoriesAndSelectAccount } from '../common-helpers/auth-helper'
import { setAmbKeyStore } from '../common-helpers/setAmbKeyStore'

describe('auth', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL, serviceWorker } = await bootstrap('auth'))
    // Bypass the invite verification step
    await serviceWorker.evaluate(
      (invite) => chrome.storage.local.set({ invite, isE2EStorageSet: true }),
      JSON.stringify(INVITE_STORAGE_ITEM)
    )

    await page.goto(`${extensionURL}/tab.html#/get-started`)
  })

  afterEach(async () => {
    await recorder.stop()
    // await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it.only('should import basic and smart accounts from a private key', async () => {
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.BA_PRIVATE_KEY)

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page)

    // Click on "Save and Continue" button
    await clickOnElement(page, '[data-testid="button-save-and-continue"]')
    await page.waitForFunction(
      () => {
        return window.location.href.includes('/onboarding-completed')
      },
      { timeout: 60000 }
    )
    const currentUrl = page.url()
    expect(currentUrl).toContain('/onboarding-completed')
    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    // Wait for account addresses to load
    await new Promise((r) => {
      setTimeout(r, 2000)
    })

    // Verify that selected accounts exist on the page
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )
    expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import basic and smart accounts from a seed phrase and personalize them', async () => {
    await setAmbKeyStore(page, '[data-testid="button-proceed-seed-phrase"]')

    const phrase = process.env.BA_PASSPHRASE

    const wordArray = phrase.split(' ')

    await page.waitForSelector('[placeholder="Word 1"]')
    for (let i = 0; i < wordArray.length; i++) {
      const wordToType = wordArray[i]

      // Type the word into the input field using page.type
      const inputSelector = `[placeholder="Word ${i + 1}"]`
      await page.type(inputSelector, wordToType)
    }

    // This function will complete the onboarding stories and will select and retrieve first basic and first smarts account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, 'true')

    // Click on "Save and Continue" button
    await clickOnElement(page, '[data-testid="button-save-and-continue"]')
    await page.waitForFunction(() => window.location.href.includes('/onboarding-completed'))
    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page
    await page.waitForFunction(
      (testId, requiredCount) => {
        return document.querySelectorAll(`[data-testid="${testId}"]`).length >= requiredCount
      },
      {},
      'address',
      2
    )
    const addresses = await page.$$eval('[data-testid="address"]', (el) =>
      el.map((e) => e.innerText)
    )
    expect(addresses).toContain(firstSelectedBasicAccount)
    expect(addresses).toContain(firstSelectedSmartAccount)
  })
})
