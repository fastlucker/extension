import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'

const puppeteer = require('puppeteer')

const puppeteerArgs = [
  `--disable-extensions-except=${__dirname}/../webkit-prod/`,
  `--load-extension=${__dirname}/webkit-prod/`,
  '--disable-features=DialMediaRouteProvider',

  // '--disable-features=ClipboardContentSetting',
  '--clipboard-write: granted',
  '--clipboard-read: prompt',

  // '--detectOpenHandles',
  '--start-maximized',

  // We need this for running Puppeteer in Github Actions
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--font-render-hinting=none',
  '--ignore-certificate-errors'
]

export async function bootstrap(options = {}) {
  const { headless = false } = options

  const browser = await puppeteer.launch({
    slowMo: 20,
    // devtools: true,
    headless,
    args: puppeteerArgs,
    defaultViewport: null,
    // DISPLAY variable is being set in tests.yml, and it's needed only for running the tests in Github actions.
    // It configures the display server and make the tests working in headful mode in Github actions.
    ...(process.env.DISPLAY && {
      env: {
        DISPLAY: process.env.DISPLAY
      }
    }),
    ignoreHTTPSErrors: true
  })

  // Extract the extension ID from the browser targets
  const targets = await browser.targets()
  const extensionTarget = targets.find((target) => target.url().includes('chrome-extension'))
  const partialExtensionUrl = extensionTarget.url() || ''
  const [, , extractedExtensionId] = partialExtensionUrl.split('/')
  const extensionId = extractedExtensionId
  const extensionRootUrl = `chrome-extension://${extensionId}`

  return {
    browser,
    extensionRootUrl,
    extensionId,
    extensionTarget
  }
}

//----------------------------------------------------------------------------------------------
export async function clickOnElement(page, selector, timeout = 5000) {
  try {
    const elementToClick = await page.waitForSelector(selector, { visible: true, timeout })
    await elementToClick.click()
  } catch (error) {
    throw new Error(`Could not click on selector: ${selector}`)
  }
}

//----------------------------------------------------------------------------------------------
export async function typeText(page, selector, text) {
  try {
    await page.waitForSelector(selector, { visible: true, timeout: 5000 })
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
export async function bootstrapWithStorage(namespace) {
  /* Initialize browser and page using bootstrap */
  const context = await bootstrap()
  const browser = context.browser
  const extensionRootUrl = context.extensionRootUrl
  const page = await browser.newPage()
  const recorder = new PuppeteerScreenRecorder(page, { followNewTab: true })
  await recorder.start(`./recorder/${namespace}_${Date.now()}.mp4`)

  // Navigate to a specific URL if necessary
  await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

  // Please note the following:
  // 1. I've added a waiting timeout in backgrounds.ts because it was not possible to predefine the storage before the app initializing process starts.
  // 2. Before that, we were trying to set the storage, but the controllers were already initialized, and their storage was empty.
  await page.evaluate(() => {
    const parsedKeystoreAccountsPreferences = JSON.parse(process.env.BA_ACCOUNT_PREFERENCES)
    const parsedKeystoreAccounts = JSON.parse(process.env.BA_ACCOUNTS)
    const parsedIsDefaultWallet = process.env.BA_IS_DEFAULT_WALLET
    const parsedKeyPreferences = JSON.parse(process.env.BA_KEY_PREFERENCES)
    const parsedKeystoreUID = process.env.BA_KEYSTORE_UID
    const parsedKeystoreKeys = JSON.parse(process.env.BA_KEYS)
    const parsedKeystoreSecrets = JSON.parse(process.env.BA_SECRETS)
    const parsedNetworkPreferences = JSON.parse(process.env.BA_NETWORK_PREFERENCES)
    const parsedNetworksWithAssetsByAccount = JSON.parse(process.env.BA_NETWORK_WITH_ASSETS)
    const parsedOnboardingState = JSON.parse(process.env.BA_ONBOARDING_STATE)
    const envPermission = process.env.BA_PERMISSION
    const parsedPreviousHints = JSON.parse(process.env.BA_PREVIOUSHINTS)
    const envSelectedAccount = process.env.BA_SELECTED_ACCOUNT
    const envTermState = process.env.BA_TERMSTATE
    const parsedTokenItems = JSON.parse(process.env.BA_TOKEN_ITEMS)

    chrome.storage.local.set({
      accountPreferences: parsedKeystoreAccountsPreferences,
      accounts: parsedKeystoreAccounts,
      isDefaultWallet: parsedIsDefaultWallet,
      keyPreferences: parsedKeyPreferences,
      keyStoreUid: parsedKeystoreUID,
      keystoreKeys: parsedKeystoreKeys,
      keystoreSecrets: parsedKeystoreSecrets,
      networkPreferences: parsedNetworkPreferences,
      networksWithAssetsByAccount: parsedNetworksWithAssetsByAccount,
      onboardingState: parsedOnboardingState,
      permission: envPermission,
      previousHints: parsedPreviousHints,
      selectedAccount: envSelectedAccount,
      termsState: envTermState,
      tokenIcons: parsedTokenItems
    })
  })
  // Please note the following:
  // 1. Every time beforeEach is invoked, we are loading a specific page, i.e., await page.goto(${extensionRootUrl}/tab.html#/keystore-unlock, { waitUntil: 'load' }).
  // 2. But at the same time, the extension onboarding page is also shown automatically.
  // 3. During these page transitions (new tabs being opened), we should wait a bit and avoid switching between or closing tabs because the extension background process is being initialized, and it will only initialize if the current tab is visible.
  // If it's not visible (when we are transitioning), the initialization fails.
  // Later, we will check how we can deal with this better.
  await new Promise((r) => {
    setTimeout(r, 2000)
  })
  // Please note that:
  // 1. We are no longer closing any tabs.
  // 2. Instead, we simply switch back to our tab under testing.
  await page.bringToFront()
  await page.reload()

  await typeSeedPhrase(page, process.env.KEYSTORE_PASS)

  return { browser, extensionRootUrl, page, recorder }
}

//----------------------------------------------------------------------------------------------
export async function sa_bootstrapWithStorage(namespace) {
  /* Initialize browser and page using bootstrap */
  const context = await bootstrap()
  const browser = context.browser
  const extensionRootUrl = context.extensionRootUrl
  const page = await browser.newPage()
  recorder = new PuppeteerScreenRecorder(page)

  await recorder.start(`./recorder/${namespace}_${Date.now()}.mp4`)

  // Navigate to a specific URL if necessary
  await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

  // Please note the following:
  // 1. I've added a waiting timeout in backgrounds.ts because it was not possible to predefine the storage before the app initializing process starts.
  // 2. Before that, we were trying to set the storage, but the controllers were already initialized, and their storage was empty.
  await page.evaluate(() => {
    const parsedKeystoreAccountsPreferences = JSON.parse(process.env.SA_ACCOUNT_PREFERENCES)
    const parsedKeystoreAccounts = JSON.parse(process.env.SA_ACCOUNTS)
    const parsedIsDefaultWallet = process.env.SA_IS_DEFAULT_WALLET
    const parsedIsOnBouarded = process.env.SA_IS_ONBOARDED
    const parsedKeyPreferences = JSON.parse(process.env.SA_KEY_PREFERENCES)
    const parsedKeystoreUID = process.env.SA_KEYSTORE_UID
    const parsedKeystoreKeys = JSON.parse(process.env.SA_KEYS)
    const parsedKeystoreSecrets = JSON.parse(process.env.SA_SECRETS)
    const parsedNetworkPreferences = JSON.parse(process.env.SA_NETWORK_PREFERENCES)
    const paresdNetworksWithAssetsByAccount = JSON.parse(process.env.SA_NETWORK_WITH_ASSETS)
    const parsedOnboardingState = JSON.parse(process.env.SA_ONBOARDING_STATE)
    const envPermission = process.env.SA_PERMISSION
    const parsedPreviousHints = JSON.parse(process.env.SA_PREVIOUSHINTS)
    const envSelectedAccount = process.env.SA_SELECTED_ACCOUNT
    const envTermState = process.env.SA_TERMSTATE
    const parsedTokenItems = JSON.parse(process.env.SA_TOKEN_ITEMS)

    chrome.storage.local.set({
      accountPreferences: parsedKeystoreAccountsPreferences,
      accounts: parsedKeystoreAccounts,
      isDefaultWallet: parsedIsDefaultWallet,
      isOnBoarded: parsedIsOnBouarded,
      keyPreferences: parsedKeyPreferences,
      keyStoreUid: parsedKeystoreUID,
      keystoreKeys: parsedKeystoreKeys,
      keystoreSecrets: parsedKeystoreSecrets,
      networkPreferences: parsedNetworkPreferences,
      networksWithAssetsByAccount: paresdNetworksWithAssetsByAccount,
      onboardingState: parsedOnboardingState,
      permission: envPermission,
      previousHints: parsedPreviousHints,
      selectedAccount: envSelectedAccount,
      termsState: envTermState,
      tokenIcons: parsedTokenItems
    })
  })
  // Please note the following:
  // 1. Every time beforeEach is invoked, we are loading a specific page, i.e., await page.goto(${extensionRootUrl}/tab.html#/keystore-unlock, { waitUntil: 'load' }).
  // 2. But at the same time, the extension onboarding page is also shown automatically.
  // 3. During these page transitions (new tabs being opened), we should wait a bit and avoid switching between or closing tabs because the extension background process is being initialized, and it will only initialize if the current tab is visible.
  // If it's not visible (when we are transitioning), the initialization fails.
  // Later, we will check how we can deal with this better.
  await new Promise((r) => {
    setTimeout(r, 2000)
  })
  // Please note that:
  // 1. We are no longer closing any tabs.
  // 2. Instead, we simply switch back to our tab under testing.
  await page.bringToFront()
  await page.reload()

  await typeSeedPhrase(page, process.env.KEYSTORE_PASS)

  return { browser, extensionRootUrl, page, recorder }
}

//----------------------------------------------------------------------------------------------
export async function setAmbKeyStore(page, privKeyOrPhraseSelector) {
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
export async function finishStoriesAndSelectAccount(page, shouldClickOnAccounts) {
  /* Click on Import button. */
  await clickOnElement(page, '[data-testid="phrase-button-import"]')

  await new Promise((r) => setTimeout(r, 2000))
  await clickOnElement(page, 'xpath///a[contains(text(), "Next")]')

  await new Promise((r) => setTimeout(r, 2000))
  await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]')
  /* Select one Legacy and one Smart account and keep the addresses of the accounts */
  await page.waitForSelector('[data-testid="checkbox"]')

  /* Select one Legacy account and one Smart account */
  const firstSelectedBasicAccount = await page.$$eval(
    '[data-testid="add-account"]',
    (element, shouldClick) => {
      if (shouldClick) element[0].click()
      return element[0].textContent
    },
    shouldClickOnAccounts
  )
  const firstSelectedSmartAccount = await page.$$eval(
    '[data-testid="add-account"]',
    (element, shouldClick) => {
      if (shouldClick) element[1].click()
      return element[1].textContent
    },
    shouldClickOnAccounts
  )
  /* Click on Import Accounts button */
  await clickOnElement(page, '[data-testid="button-import-account"]:not([disabled])')
  await page.waitForFunction("window.location.hash == '#/account-personalize'")

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

  newPage.setViewport({
    width: 1000,
    height: 1000
  })

  const recorder = new PuppeteerScreenRecorder(newPage, { followNewTab: true })

  await recorder.start(`./recorder/transactions_notification_window_${Date.now()}.mp4`)

  /* Click on "Ape" button */
  await clickOnElement(newPage, '[data-testid="fee-ape:"]')

  /* Click on "Sign" button */
  await clickOnElement(newPage, '[data-testid="transaction-button-sign"]')

  // Wait for the 'Timestamp' text to appear twice on the page
  await newPage.waitForFunction(() => {
    const pageText = document.documentElement.innerText
    const occurrences = (pageText.match(/Timestamp/g) || []).length
    return occurrences >= 2
  })

  const doesFailedExist = await newPage.evaluate(() => {
    return document.documentElement.innerText.includes('Failed')
  })

  await new Promise((r) => setTimeout(r, 300))

  await recorder.stop()

  expect(doesFailedExist).toBe(false) // This will fail the test if 'Failed' exists
}
