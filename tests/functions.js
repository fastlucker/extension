import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import { ethers, Network } from 'ethers'

const puppeteer = require('puppeteer')

let recorder

const puppeteerArgs = [
  `--disable-extensions-except=${__dirname}/../webkit-prod/`,
  `--load-extension=${__dirname}/webkit-prod/`,
  '--disable-features=DialMediaRouteProvider',

  // '--disable-features=ClipboardContentSetting',
  '--clipboard-write: granted',
  '--clipboard-read: prompt',

  // '--detectOpenHandles',
  '--start-maximized',

  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',

  // We need this for running Puppeteer in Github Actions
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--font-render-hinting=none',
  '--ignore-certificate-errors',
  '--window-size=1920,1080'
]

export async function bootstrap(options = {}) {
  const { headless = false } = options

  const browser = await puppeteer.launch({
    slowMo: 0,
    // devtools: true,
    headless,
    args: puppeteerArgs,
    defaultViewport: null,
    // DISPLAY variable is being set in tests.yml, and it's needed only for running the tests in Github actions.
    // It configures the display server and make the tests working in headful mode in Github actions.
    ...(process.env.DISPLAY && {
      env: { DISPLAY: process.env.DISPLAY }
    }),
    ignoreHTTPSErrors: true
  })

  // Extract the extension ID from the browser targets
  const targets = await browser.targets()
  const backgroundTarget = targets.find((target) => target.type() === 'background_page')
  const extensionTarget = targets.find((target) => target.url().includes('chrome-extension'))
  const partialExtensionUrl = extensionTarget.url() || ''
  const [, , extractedExtensionId] = partialExtensionUrl.split('/')
  const extensionId = extractedExtensionId
  const extensionRootUrl = `chrome-extension://${extensionId}`

  return {
    browser,
    extensionRootUrl,
    extensionId,
    extensionTarget,
    backgroundTarget
  }
}

//----------------------------------------------------------------------------------------------
export async function clickOnElement(page, selector, waitUntilEnabled = true, clickDelay = 0) {
  const elementToClick = await page.waitForSelector(selector, { visible: true })

  let isClickable = false
  if (waitUntilEnabled) {
    while (!isClickable) {
      isClickable = await page.evaluate((selector) => {
        const buttonElement = document.querySelector(selector)
        return (
          buttonElement &&
          !buttonElement.disabled &&
          window.getComputedStyle(buttonElement).pointerEvents !== 'none'
        )
      }, selector)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  if (!waitUntilEnabled) {
    // in case the button was disabled wait for it state to be updated before clicking on it
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  if (isClickable || !waitUntilEnabled) {
    if (clickDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, clickDelay))
    }
    await elementToClick.click()
  }
}

//----------------------------------------------------------------------------------------------
export async function clickElementWithRetry(page, selector, maxRetries = 5) {
  let retries = 0
  while (retries < maxRetries) {
    const element = await page.$(selector)
    if (element) {
      await element.click()
      return
    }
    await page.waitForTimeout(500) // Wait for 1/2 second before trying again
    retries++
  }
  throw new Error(`Element ${selector} not found or not clickable after ${maxRetries} retries`)
}
//----------------------------------------------------------------------------------------------
export async function typeText(page, selector, text) {
  await page.waitForSelector(selector)
  const whereToType = await page.$(selector)
  await whereToType.click({ clickCount: 3 })
  await whereToType.press('Backspace')
  await whereToType.type(text, { delay: 10 })
}

//----------------------------------------------------------------------------------------------
export async function typeSeedPhrase(page, seedPhrase) {
  await new Promise((r) => setTimeout(r, 2000))

  await page.waitForSelector('[data-testid="passphrase-field"]')

  await typeText(page, '[data-testid="passphrase-field"]', seedPhrase)
  // Click on "Unlock button"
  await clickOnElement(page, '[data-testid="button-unlock"]')

  await page.waitForSelector('[data-testid="full-balance"]')
}

//----------------------------------------------------------------------------------------------
export const INVITE_STORAGE_ITEM = {
  status: 'VERIFIED',
  verifiedAt: 1715332416400,
  verifiedCode: 'dummy-test-code'
}

export const baParams = {
  parsedKeystoreAccountsPreferences: JSON.parse(process.env.BA_ACCOUNT_PREFERENCES),
  parsedKeystoreAccounts: JSON.parse(process.env.BA_ACCOUNTS),
  parsedIsDefaultWallet: process.env.BA_IS_DEFAULT_WALLET,
  parsedKeyPreferences: JSON.parse(process.env.BA_KEY_PREFERENCES),
  parsedKeystoreUID: process.env.BA_KEYSTORE_UID,
  parsedKeystoreKeys: JSON.parse(process.env.BA_KEYS),
  parsedKeystoreSecrets: JSON.parse(process.env.BA_SECRETS),
  parsedNetworkPreferences: JSON.parse(process.env.BA_NETWORK_PREFERENCES),
  parsedNetworksWithAssetsByAccount: JSON.parse(process.env.BA_NETWORK_WITH_ASSETS),
  parsedOnboardingState: JSON.parse(process.env.BA_ONBOARDING_STATE),
  envPermission: process.env.BA_PERMISSION,
  parsedPreviousHints: JSON.parse(process.env.BA_PREVIOUSHINTS),
  envSelectedAccount: process.env.BA_SELECTED_ACCOUNT,
  envTermState: process.env.BA_TERMSTATE,
  parsedTokenItems: JSON.parse(process.env.BA_TOKEN_ITEMS),
  invite: JSON.stringify(INVITE_STORAGE_ITEM)
}

export const saParams = {
  parsedKeystoreAccountsPreferences: JSON.parse(process.env.SA_ACCOUNT_PREFERENCES),
  parsedKeystoreAccounts: JSON.parse(process.env.SA_ACCOUNTS),
  parsedIsDefaultWallet: process.env.SA_IS_DEFAULT_WALLET,
  parsedIsOnBoarded: process.env.SA_IS_ONBOARDED,
  parsedKeyPreferences: JSON.parse(process.env.SA_KEY_PREFERENCES),
  parsedKeystoreUID: process.env.SA_KEYSTORE_UID,
  parsedKeystoreKeys: JSON.parse(process.env.SA_KEYS),
  parsedKeystoreSecrets: JSON.parse(process.env.SA_SECRETS),
  parsedNetworkPreferences: JSON.parse(process.env.SA_NETWORK_PREFERENCES),
  parsedNetworksWithAssetsByAccount: JSON.parse(process.env.SA_NETWORK_WITH_ASSETS),
  parsedOnboardingState: JSON.parse(process.env.SA_ONBOARDING_STATE),
  envPermission: process.env.SA_PERMISSION,
  parsedPreviousHints: JSON.parse(process.env.SA_PREVIOUSHINTS),
  envSelectedAccount: process.env.SA_SELECTED_ACCOUNT,
  envTermState: process.env.SA_TERMSTATE,
  parsedTokenItems: JSON.parse(process.env.SA_TOKEN_ITEMS),
  invite: JSON.stringify(INVITE_STORAGE_ITEM)
}

//----------------------------------------------------------------------------------------------
export async function bootstrapWithStorage(namespace, params) {
  // Initialize browser and page using bootstrap
  const { browser, extensionRootUrl, backgroundTarget } = await bootstrap()
  const backgroundPage = await backgroundTarget.page()
  await backgroundPage.evaluate(
    (params) =>
      chrome.storage.local.set({
        accountPreferences: params.parsedKeystoreAccountsPreferences,
        accounts: params.parsedKeystoreAccounts,
        isDefaultWallet: params.parsedIsDefaultWallet,
        keyPreferences: params.parsedKeyPreferences,
        keyStoreUid: params.parsedKeystoreUID,
        keystoreKeys: params.parsedKeystoreKeys,
        keystoreSecrets: params.parsedKeystoreSecrets,
        networkPreferences: params.parsedNetworkPreferences,
        networksWithAssetsByAccount: params.parsedNetworksWithAssetsByAccount,
        onboardingState: params.parsedOnboardingState,
        permission: params.envPermission,
        previousHints: params.parsedPreviousHints,
        selectedAccount: params.envSelectedAccount,
        termsState: params.envTermState,
        tokenIcons: params.parsedTokenItems,
        invite: params.invite
      }),
    params
  )

  const page = await browser.newPage()
  page.setDefaultTimeout(120000)
  recorder = new PuppeteerScreenRecorder(page, { followNewTab: true })
  await recorder.start(`./recorder/${namespace}_${Date.now()}.mp4`)

  // Navigate to a specific URL if necessary
  await page.goto(`${extensionRootUrl}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

  // Please note that:
  // 1. We are no longer closing any tabs.
  // 2. Instead, we simply switch back to our tab under testing.
  await page.bringToFront()
  // we need to catch the error because in other way recorder will not be returned and test will fail with error
  try {
    await typeSeedPhrase(page, process.env.KEYSTORE_PASS)
  } catch (error) {
    console.log('typeSeedPhrase ERROR: ', error)
  }
  return { browser, extensionRootUrl, page, recorder }
}

//----------------------------------------------------------------------------------------------
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
  await clickOnElement(page, '[data-testid="keystore-button-continue"]', true, 2000)
}

//----------------------------------------------------------------------------------------------
export async function finishStoriesAndSelectAccount(page, shouldClickOnAccounts) {
  // Click on Import button.
  await clickOnElement(page, '[data-testid="import-button"]')
  await page.waitForFunction(() => window.location.href.includes('/account-adder'))

  await clickOnElement(page, 'xpath///a[contains(text(), "Next")]', false, 2000)
  await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]', false, 2000)

  // Select one Legacy and one Smart account and keep the addresses of the accounts
  await page.waitForSelector('[data-testid="checkbox"]')

  // Select one Legacy account and one Smart account
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

  await Promise.all([
    // Click on Import Accounts button
    clickOnElement(page, '[data-testid="button-import-account"]:not([disabled])'),
    page.waitForNavigation()
  ])

  return { firstSelectedBasicAccount, firstSelectedSmartAccount }
}

//----------------------------------------------------------------------------------------------
export async function selectMaticToken(page) {
  await clickOnElement(page, '[data-testid="tokens-select"]')
  await clickOnElement(
    page,
    '[data-testid="option-0x0000000000000000000000000000000000000000.polygon.matic.false."]'
  )
}

//----------------------------------------------------------------------------------------------
export async function confirmTransaction(
  page,
  extensionRootUrl,
  browser,
  triggerTransactionSelector,
  feeToken
) {
  await clickOnElement(page, triggerTransactionSelector)

  const newTarget = await browser.waitForTarget((target) =>
    target.url().startsWith(`${extensionRootUrl}/action-window.html#`)
  )
  let actionWindowPage = await newTarget.page()
  actionWindowPage.setDefaultTimeout(240000)

  actionWindowPage.setViewport({ width: 1300, height: 700 })

  // Check if "sign-message" action-window is open
  if (actionWindowPage.url().endsWith('/sign-message')) {
    console.log('New window before transaction is open')
    // If the selector exists, click on it
    await actionWindowPage.click('[data-testid="button-sign"]')

    const newPagePromise2 = await browser.waitForTarget(
      (target) => target.url() === `${extensionRootUrl}/action-window.html#/sign-account-op`
    )
    const newPageTarget = await newPagePromise2

    actionWindowPage = await newPageTarget.page() // Update actionWindowPage to capture the new window
    actionWindowPage.setDefaultTimeout(240000)
  }

  // Check if select fee token is visible
  const tokenSelect = await actionWindowPage.evaluate(
    () => !!document.querySelector('[data-testid="select"]')
  )

  if (tokenSelect) {
    // Get the text content of the element
    const selectText = await actionWindowPage.evaluate(() => {
      const element = document.querySelector('[data-testid="select"]')
      return element.textContent.trim()
    })

    // Check if the text contains "Gas Tank". It means that pay fee by gas tank is selected
    if (selectText.includes('Gas Tank')) {
      // Click on the tokens select
      await clickOnElement(actionWindowPage, '[data-testid="select"]')
      await actionWindowPage.waitForSelector('[data-testid="select-menu"]')
      // Click on the Gas Tank option
      await clickOnElement(actionWindowPage, feeToken)
    }
  }
  // Click on "Ape" button
  await clickOnElement(actionWindowPage, '[data-testid="fee-ape:"]')

  // Click on "Sign" button
  await clickOnElement(actionWindowPage, '[data-testid="transaction-button-sign"]')
  // Wait for the 'Timestamp' text to appear twice on the page
  await actionWindowPage.waitForFunction(
    () => {
      const pageText = document.documentElement.innerText
      const occurrences = (pageText.match(/Timestamp/g) || []).length
      return occurrences >= 2
    },
    { timeout: 250000 }
  )

  const doesFailedExist = await actionWindowPage.evaluate(() => {
    const pageText = document.documentElement.innerText
    return pageText.includes('failed') || pageText.includes('dropped')
  })

  expect(doesFailedExist).toBe(false) // This will fail the test if 'Failed' exists

  const currentURL = await actionWindowPage.url()

  // Split the URL by the '=' character and get the transaction hash
  const parts = currentURL.split('=')
  const transactionHash = parts[parts.length - 1]

  // Create a provider instance using the JsonRpcProvider
  const staticNetwork = Network.from(137)
  const provider = new ethers.JsonRpcProvider(
    'https://invictus.ambire.com/polygon',
    staticNetwork,
    { staticNetwork }
  )

  // Get transaction receipt
  const receipt = await provider.getTransactionReceipt(transactionHash)
  console.log(`Transaction Hash: ${transactionHash}`)
  console.log('getTransactionReceipt result', receipt)
  // Assertion to fail the test if transaction failed
  expect(receipt.status).toBe(1)
}
