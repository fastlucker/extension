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

  //--------------------------------------------------------------------------------------------------------------
  it.only('should import view-only accounts', async () => {
    const smartAccount = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'

    const basicAccount = '0x048d8573402CE085A6c8f34d568eC2Ccc995196e'

    // Click on "Next" button several times to finish the onboarding.
    await clickOnElement(page, '[data-testid="stories-button-next-0"]')
    await clickOnElement(page, '[data-testid="stories-button-next-1"]')
    await clickOnElement(page, '[data-testid="stories-button-next-2"]')
    await clickOnElement(page, '[data-testid="stories-button-next-3"]')
    await clickOnElement(page, '[data-testid="stories-button-next-4"]')

    // check the checkbox "I agree ..."
    await page.$eval('[data-testid="checkbox"]', (button) => button.click())

    // Click on "Got it"
    await clickOnElement(page, '[data-testid="stories-button-next-5"]')

    await page.waitForFunction(() => window.location.href.includes('/get-started'))

    // Select "Add"
    await clickOnElement(page, '[data-testid="get-started-button-add"]')

    await typeText(page, '[data-testid="address-ens-field"]', smartAccount)

    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, '[data-testid="view-only-button-import"]')

    await clickOnElement(page, '[data-testid="button-save-and-continue"]')

    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })

    // Find the element containing the specified address
    const addressElement = await page.$x(`//*[contains(text(), '${smartAccount}')]`)

    if (addressElement.length > 0) {
      // Get the parent element of the element with the specified address
      const parentElement = await addressElement[0].$x('../../..')

      if (parentElement.length > 0) {
        // Get the text content of the parent element and all elements within it
        const parentTextContent = await page.evaluate((element) => {
          const elements = element.querySelectorAll('*')
          return Array.from(elements, (el) => el.textContent).join('\n')
        }, parentElement[0])

        // Verify that somewhere in the content there is the text 'View-only'
        const containsViewOnly = parentTextContent.includes('View-only')

        expect(containsViewOnly).toBe(true)
      }
    }

    await clickOnElement(page, '[data-testid="button-add-account"]')
    // await page.waitForSelector('[data-testid="create-new-wallet"]')
    // await new Promise((r) => {
    //   setTimeout(r, 1000)
    // })
    await clickOnElement(page, '[data-testid="watch-address"]', true, 1500)
    await typeText(page, '[data-testid="address-ens-field"]', basicAccount)
    // Click on "Import View-Only Accounts" button
    await clickOnElement(page, '[data-testid="view-only-button-import"]')
    await clickOnElement(page, '[data-testid="button-save-and-continue"]')
    await page.goto(`${extensionURL}/tab.html#/account-select`, { waitUntil: 'load' })
  })
})
