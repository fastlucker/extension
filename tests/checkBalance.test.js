import { bootstrap, typeSeedPhrase, clickOnElement } from './functions.js'

const puppeteer = require('puppeteer')

describe('balance', () => {
  let browser
  let page
  let extensionRootUrl

  beforeEach(async () => {
    /* Initialize browser and page using bootStrap */
    const context = await bootstrap({ headless: false, slowMo: 10 })
    browser = context.browser
    extensionRootUrl = context.extensionRootUrl
    page = await browser.newPage()

    // Navigate to a specific URL if necessary
    await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

    /*  interact with chrome.storage.local in the context of the extension's background page */
    await page.evaluate(() => {
      let parsedKeystoreAccounts
      let parsedKeystoreUID
      let parsedKeystoreKeys
      let parsedKeystoreSecrets
      let envOnboardingStatus
      let envPermission
      let envSelectedAccount
      let envTermState
      let parsedPreviousHints
      parsedKeystoreAccounts = JSON.parse(process.env.KEYSTORE_ACCOUNTS_1)
      parsedKeystoreUID = process.env.KEYSTORE_KEYSTORE_UID_1
      parsedKeystoreKeys = JSON.parse(process.env.KEYSTORE_KEYS_1)
      parsedKeystoreSecrets = JSON.parse(process.env.KEYSTORE_SECRETS_1)
      envOnboardingStatus = process.env.KEYSTORE_ONBOARDING_STATUS_1
      envPermission = process.env.KEYSTORE_PERMISSION_1
      envSelectedAccount = process.env.KEYSTORE_SELECTED_ACCOUNT_1
      envTermState = process.env.KEYSTORE_TERMSTATE_1
      parsedPreviousHints = process.env.KEYSTORE_PREVIOUSHINTS_1
      chrome.storage.local.set({
        accounts: parsedKeystoreAccounts,
        keyStoreUid: parsedKeystoreUID,
        keystoreKeys: parsedKeystoreKeys,
        keystoreSecrets: parsedKeystoreSecrets,
        onboardingStatus: envOnboardingStatus,
        permission: envPermission,
        selectedAccount: envSelectedAccount,
        termsState: envTermState,
        previousHints: parsedPreviousHints
      })
    })

    // Please note the following:
    // 1. Every time beforeEach is invoked, we are loading a specific page, i.e., await page.goto(${extensionRootUrl}/tab.html#/keystore-unlock, { waitUntil: 'load' }).
    // 2. But at the same time, the extension onboarding page is also shown automatically.
    // 3. During these page transitions (new tabs being opened), we should wait a bit and avoid switching between or closing tabs because the extension background process is being initialized, and it will only initialize if the current tab is visible.
    // If it's not visible (when we are transitioning), the initialization fails.
    // Later, we will check how we can deal with this better.
    // Please note the following:
    // 1. Every time beforeEach is invoked, we are loading a specific page, i.e., await page.goto(${extensionRootUrl}/tab.html#/keystore-unlock, { waitUntil: 'load' }).
    // 2. But at the same time, the extension onboarding page is also shown automatically.
    // 3. During these page transitions (new tabs being opened), we should wait a bit and avoid switching between or closing tabs because the extension background process is being initialized, and it will only initialize if the current tab is visible.
    // If it's not visible (when we are transitioning), the initialization fails.
    // Later, we will check how we can deal with this better.
    await new Promise((r) => {
      setTimeout(r, 1000)
    })
    // Please note that:
    // 1. We are no longer closing any tabs.
    // 2. Instead, we simply switch back to our tab under testing.
    // Please note that:
    // 1. We are no longer closing any tabs.
    // 2. Instead, we simply switch back to our tab under testing.
    await page.bringToFront()
    await page.reload()

    await typeSeedPhrase(page, process.env.KEYSTORE_PASS_PHRASE_1)
  })

  afterEach(async () => {
    await browser.close()
  })

  it('check the balance in account ', async () => {
    await page.waitForSelector('[data-testid="full-balance"]')
    /* Get the available balance */
    const availableAmmount = await page.evaluate(() => {
      const balance = document.querySelector('[data-testid="full-balance"]')
      return balance.innerText
    })

    let availableAmmountNum = availableAmmount.replace(/\n/g, '')
    availableAmmountNum = availableAmmountNum.split('$')[1]

    /* Verify that the balance is bigger than 0 */
    expect(parseFloat(availableAmmountNum) > 0).toBeTruthy()
  })
})
