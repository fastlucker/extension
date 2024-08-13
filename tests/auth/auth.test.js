import { INVITE_STORAGE_ITEM } from '../constants/constants'
import { bootstrap } from '../common-helpers/bootstrap'
import { clickOnElement } from '../common-helpers/clickOnElement'
import { typeText } from '../common-helpers/typeText'
import { finishStoriesAndSelectAccount } from './auth-helper'
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
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('should import basic and smart accounts from a private key', async () => {
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.BA_PRIVATE_KEY)

    // Click on Import button.
    await clickOnElement(page, '[data-testid="import-button"]')

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
    await setAmbKeyStore(page, '[data-testid="button-import-private-key"]')
    await page.waitForSelector('[data-testid="enter-seed-phrase-field"]')

    await typeText(page, '[data-testid="enter-seed-phrase-field"]', process.env.BA_PRIVATE_KEY)
    // Click on Import button.
    await clickOnElement(page, '[data-testid="import-button"]')

    // This function will complete the onboarding stories and will select and retrieve first basic and first smart account
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page)

    const accountName1 = 'Test-Account-1'
    const accountName2 = 'Test-Account-2'

    const editAccountNameFields = await page.$$('[data-testid="editable-button"]')

    await editAccountNameFields[0].click()
    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '[data-testid="edit-name-field-0"]', accountName1)

    await editAccountNameFields[1].click()
    await new Promise((r) => setTimeout(r, 500))

    await typeText(page, '[data-testid="edit-name-field-1"]', accountName2)

    // Click on the checkmark icon to save the new account names
    editAccountNameFields[0].click()
    editAccountNameFields[1].click()

    // Click on "Save and Continue" button
    await new Promise((r) => setTimeout(r, 1000))
    await clickOnElement(page, '[data-testid="button-save-and-continue"]:not([disabled])')

    const newHref = await page.evaluate(() => window.location.href)
    expect(newHref).toContain('/onboarding-completed')

    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    // Verify that selected accounts exist on the page and contains the new names
    const selectedBasicAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[0].innerText
    )
    expect(selectedBasicAccount).toContain(accountName1)

    const selectedSmartAccount = await page.$$eval(
      '[data-testid="account"]',
      (el) => el[1].innerText
    )

    expect(selectedBasicAccount).toContain(firstSelectedBasicAccount)
    expect(selectedBasicAccount).toContain(accountName1)
    expect(selectedSmartAccount).toContain(firstSelectedSmartAccount)
    expect(selectedSmartAccount).toContain(accountName2)
  })
})
