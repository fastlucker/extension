const puppeteer = require('puppeteer')

let browser
let page
let extensionRootUrl

const puppeteerArgs = [
  `--disable-extensions-except=${__dirname}/../webkit-prod/`,
  `--load-extension=${__dirname}/webkit-prod/`,
  '--disable-features=DialMediaRouteProvider',

  // '--disable-features=ClipboardContentSetting',
  '--clipboard-write: granted',
  '--clipboard-read: prompt',

  // '--detectOpenHandles',
  // '--start-maximized',

  // We need this for running Puppeteer in Github Actions
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--font-render-hinting=none'
]

export async function bootstrap(options = {}) {
  const { devtools = false, slowMo = 10, headless = false } = options

  browser = await puppeteer.launch({
    headless,
    devtools,
    args: puppeteerArgs,
    defaultViewport: null,
    slowMo,
    // DISPLAY variable is being set in tests.yml, and it's needed only for running the tests in Github actions.
    // It configures the display server and make the tests working in headful mode in Github actions.
    ...(process.env.DISPLAY && {
      env: {
        DISPLAY: process.env.DISPLAY
      }
    })
  })

  // Extract the extension ID from the browser targets
  const targets = await browser.targets()
  const extensionTarget = targets.find((target) => target.url().includes('chrome-extension'))
  const partialExtensionUrl = extensionTarget.url() || ''
  const [, , extractedExtensionId] = partialExtensionUrl.split('/')
  const extensionId = extractedExtensionId
  extensionRootUrl = `chrome-extension://${extensionId}`

  return {
    browser,
    page,
    extensionRootUrl,
    extensionId,
    extensionTarget
  }
}

//----------------------------------------------------------------------------------------------
export async function clickOnElement(page, selector) {
  try {
    const elementToClick = await page.waitForSelector(selector, { visible: true, timeout: 5000 })
    await elementToClick.click()
  } catch (error) {
    console.log({ error })
    throw new Error(`Could not click on selector: ${selector}`)
  }
}

//----------------------------------------------------------------------------------------------
export async function typeText(page, selector, text) {
  try {
    await page.waitForSelector(selector)
    const whereToType = await page.$(selector)
    await whereToType.click({ clickCount: 3 })
    await whereToType.press('Backspace')
    await whereToType.type(text, { delay: 10 })
  } catch (error) {
    throw new Error(`Could not type text: ${text}
          in the selector: ${selector}`)
  }
}

//----------------------------------------------------------------------------------------------
export async function typeSeedPhrase(page, seedPhrase) {
  await new Promise((r) => setTimeout(r, 2000))

  await page.waitForSelector('[data-testid="passphrase-field"]')

  await typeText(page, '[data-testid="passphrase-field"]', seedPhrase)
  /* Click on "Unlock button" */
  await clickOnElement(page, '[data-testid="button-unlock"]')

  await page.waitForSelector('[data-testid="full-balance"]')
}

//----------------------------------------------------------------------------------------------
export async function setLocalStorage() {
  /* Initialize browser and page using bootstrap */
  const context = await bootstrap({ headless: false, slowMo: 10 })
  browser = context.browser
  extensionRootUrl = context.extensionRootUrl
  page = await browser.newPage()

  // Navigate to a specific URL if necessary
  await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

  // Please note the following:
  // 1. I've added a waiting timeout in backgrounds.ts because it was not possible to predefine the storage before the app initializing process starts.
  // 2. Before that, we were trying to set the storage, but the controllers were already initialized, and their storage was empty.
  await page.evaluate(() => {
    // let parsedKeystoreAccounts
    // let parsedKeystoreUID
    // let parsedKeystoreKeys
    // let parsedKeystoreSecrets
    // let envOnboardingStatus
    // let envPermission
    // let envSelectedAccount
    // let envTermState
    // let parsedPreviousHints
    const parsedKeystoreAccounts = JSON.parse(process.env.KEYSTORE_ACCOUNTS_1)
    const parsedKeystoreUID = process.env.KEYSTORE_KEYSTORE_UID_1
    const parsedKeystoreKeys = JSON.parse(process.env.KEYSTORE_KEYS_1)
    const parsedKeystoreSecrets = JSON.parse(process.env.KEYSTORE_SECRETS_1)
    const envOnboardingStatus = process.env.KEYSTORE_ONBOARDING_STATUS_1
    const envPermission = process.env.KEYSTORE_PERMISSION_1
    const envSelectedAccount = process.env.KEYSTORE_SELECTED_ACCOUNT_1
    const envTermState = process.env.KEYSTORE_TERMSTATE_1
    const parsedPreviousHints = process.env.KEYSTORE_PREVIOUSHINTS_1
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
  await new Promise((r) => {
    setTimeout(r, 1000)
  })
  // Please note that:
  // 1. We are no longer closing any tabs.
  // 2. Instead, we simply switch back to our tab under testing.
  await page.bringToFront()
  await page.reload()

  await typeSeedPhrase(page, process.env.KEYSTORE_PASS_PHRASE_1)

  return { browser, extensionRootUrl, page }
}

//----------------------------------------------------------------------------------------------
export async function setAmbKeyStoreForLegacy(page, privKeyOrPhraseSelector) {
  await new Promise((r) => setTimeout(r, 1000))
  const buttonNext = '[data-testid="stories-button-next"]'

  await page.waitForSelector(buttonNext)

  /* Click on "Next" button several times to finish the onboarding */
  await page.$eval(buttonNext, (button) => button.click())

  await page.waitForSelector('[data-testid="stories-button-previous"]')

  await page.$eval(buttonNext, (button) => button.click())
  await page.$eval(buttonNext, (button) => button.click())
  await page.$eval(buttonNext, (button) => button.click())
  await page.$eval(buttonNext, (button) => button.click())

  /* check the checkbox "I agree ..." */
  await page.$eval('[data-testid="checkbox"]', (button) => button.click())
  /* Click on "Got it" */
  await page.$eval(buttonNext, (button) => button.click())

  await page.waitForXPath('//div[contains(text(), "Welcome to your Ambire Wallet")]')

  /* Click on "Import" button */
  await page.$eval('[data-testid="get-started-button-import"]', (button) => button.click())

  await page.waitForFunction(
    () => {
      return window.location.href.includes('/import-hot-wallet')
    },
    { timeout: 60000 }
  )
  /* Click on "Import" private key */
  await page.$eval(privKeyOrPhraseSelector, (button) => button.click())

  /* type phrase */
  const phrase = 'Password'
  await typeText(page, '[data-testid="enter-pass-field"]', phrase)
  await typeText(page, '[data-testid="repeat-pass-field"]', phrase)

  /* Click on "Set up Ambire Key Store" button */
  await clickOnElement(page, '[data-testid="keystore-button-create"]')

  await page.waitForSelector('[data-testid="keystore-button-continue"]')

  await page.$eval('[data-testid="keystore-button-continue"]', (button) => button.click())
}
//----------------------------------------------------------------------------------------------
export async function finishStoriesAndSelectAccount(page) {
  /* Click on Import button. */
  await clickOnElement(page, '[data-testid="phrase-button-import"]')

  await new Promise((r) => setTimeout(r, 2000))
  await clickOnElement(page, 'xpath///a[contains(text(), "Next")]')

  await new Promise((r) => setTimeout(r, 2000))
  await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]')
  /* Select one Legacy and one Smart account and keep the addresses of the accounts */
  await page.waitForSelector('[data-testid="checkbox"]')

  /* Select one Legacy account and one Smart account */
  const firstSelectedBasicAccount = await page.$$eval('[data-testid="add-account"]', (element) => {
    element[0].click()
    return element[0].textContent
  })
  const firstSelectedSmartAccount = await page.$$eval('[data-testid="add-account"]', (element) => {
    element[1].click()
    return element[1].textContent
  })
  /* Click on Import Accounts button */
  await clickOnElement(page, '[data-testid="button-import-account"]:not([disabled])')

  return {
    firstSelectedBasicAccount,
    firstSelectedSmartAccount
  }
}

//----------------------------------------------------------------------------------------------
export async function confirmTransaction(
  page,
  extensionRootUrl,
  browser,
  triggerTransactionSelector
) {
  const elementToClick = await page.waitForSelector(triggerTransactionSelector)
  await elementToClick.click()

  await new Promise((r) => setTimeout(r, 1000))

  // Wait for the new page to be created
  const newTarget = await browser.waitForTarget(
    (target) => target.url() === `${extensionRootUrl}/notification.html#/sign-account-op`
  )
  const newPage = await newTarget.page()

  /* Click on "Medium" button */
  await clickOnElement(newPage, 'xpath///div[contains(text(), "Medium:")]')

  /* Click on "Sign" button */
  await clickOnElement(newPage, '[data-testid="transaction-button-sign"]')

  // Wait for the 'Timestamp' text to appear twice on the page
  await newPage.waitForFunction(
    () => {
      const pageText = document.documentElement.innerText
      const occurrences = (pageText.match(/Timestamp/g) || []).length
      return occurrences >= 2
    },
    { timeout: 120000 }
  )

  const doesFailedExist = await newPage.evaluate(() => {
    return document.documentElement.innerText.includes('Failed')
  })

  await new Promise((r) => setTimeout(r, 300))

  expect(doesFailedExist).toBe(false) // This will fail the test if 'Failed' exists
}
