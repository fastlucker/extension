import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'
import { ethers } from 'ethers'

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
  '--ignore-certificate-errors',
  '--window-size=1920,1080'
]

export async function bootstrap(options = {}) {
  const { headless = false } = options

  const browser = await puppeteer.launch({
    slowMo: 30,
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
export async function clickOnElement(page, selector) {
  try {
    const elementToClick = await page.waitForSelector(selector, { visible: true, timeout: 5000 })
    await elementToClick.click()
  } catch (error) {
    throw new Error(`Could not click on selector: ${selector}`)
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
export const INVITE_STORAGE_ITEM = {
  status: 'VERIFIED',
  verifiedAt: 1715332416400,
  verifiedCode: 'dummy-test-code'
}

const baParams = {
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

const saParams = {
  parsedKeystoreAccountsPreferences: JSON.parse(process.env.SA_ACCOUNT_PREFERENCES),
  parsedKeystoreAccounts: JSON.parse(process.env.SA_ACCOUNTS),
  parsedIsDefaultWallet: process.env.SA_IS_DEFAULT_WALLET,
  parsedIsOnBoarded: process.env.SA_IS_ONBOARDED,
  parsedKeyPreferences: JSON.parse(process.env.SA_KEY_PREFERENCES),
  parsedKeystoreUID: process.env.SA_KEYSTORE_UID,
  parsedKeystoreKeys: JSON.parse(process.env.SA_KEYS),
  parsedKeystoreSecrets: JSON.parse(process.env.SA_SECRETS),
  parsedNetworkPreferences: JSON.parse(process.env.SA_NETWORK_PREFERENCES),
  paresdNetworksWithAssetsByAccount: JSON.parse(process.env.SA_NETWORK_WITH_ASSETS),
  parsedOnboardingState: JSON.parse(process.env.SA_ONBOARDING_STATE),
  envPermission: process.env.SA_PERMISSION,
  parsedPreviousHints: JSON.parse(process.env.SA_PREVIOUSHINTS),
  envSelectedAccount: process.env.SA_SELECTED_ACCOUNT,
  envTermState: process.env.SA_TERMSTATE,
  parsedTokenItems: JSON.parse(process.env.SA_TOKEN_ITEMS),
  invite: JSON.stringify(INVITE_STORAGE_ITEM)
}

export { saParams, baParams } // Export the params object

//----------------------------------------------------------------------------------------------
export async function bootstrapWithStorage(namespace, params) {
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
  await page.evaluate((params) => {
    const {
      parsedKeystoreAccountsPreferences,
      parsedKeystoreAccounts,
      parsedIsDefaultWallet,
      parsedKeyPreferences,
      parsedKeystoreUID,
      parsedKeystoreKeys,
      parsedKeystoreSecrets,
      parsedNetworkPreferences,
      parsedNetworksWithAssetsByAccount,
      parsedOnboardingState,
      envPermission,
      parsedPreviousHints,
      envSelectedAccount,
      envTermState,
      parsedTokenItems,
      invite
    } = params

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
      tokenIcons: parsedTokenItems,
      invite
    })
  }, params)

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

  await page.waitForSelector('[data-testid="get-started-button-import"]')

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
export async function selectMaticToken(page) {
  await clickOnElement(page, '[data-testid="tokens-select"]')
  await clickOnElement(
    page,
    '[data-testid="option-0x0000000000000000000000000000000000000000-polygon-matic"]'
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
  const elementToClick = await page.waitForSelector(triggerTransactionSelector)
  await elementToClick.click()

  await new Promise((r) => setTimeout(r, 1000))

  const newTarget = await browser.waitForTarget((target) =>
    target.url().startsWith(`${extensionRootUrl}/notification.html#`)
  )

  let newPage = await newTarget.page()
  newPage.setViewport({
    width: 1300,
    height: 700
  })
  await new Promise((r) => setTimeout(r, 2000))

  // Check if "sign-message" window is open
  const buttonSignExists = await newPage.evaluate(() => {
    return !!document.querySelector('[data-testid="button-sign"]')
  })

  if (buttonSignExists) {
    console.log('New window before transaction is open')
    // If the selector exists, click on it
    await newPage.click('[data-testid="button-sign"]')

    const newPagePromise2 = await browser.waitForTarget(
      (target) => target.url() === `${extensionRootUrl}/notification.html#/sign-account-op`
    )
    const newPageTarget = await newPagePromise2

    newPage = await newPageTarget.page() // Update newPage to capture the new window
  }

  // Check if select fee token is visible
  const selectToken = await newPage.evaluate(() => {
    return !!document.querySelector('[data-testid="tokens-select"]')
  })

  if (selectToken) {
    // Get the text content of the element
    const selectText = await newPage.evaluate(() => {
      const element = document.querySelector('[data-testid="tokens-select"]')
      return element.textContent.trim()
    })

    // Check if the text contains "Gas Tank". It means that pay fee by gas tank is selected
    if (selectText.includes('Gas Tank')) {
      // Click on the tokens select
      await clickOnElement(newPage, '[data-testid="tokens-select"]')
      // Wait for some time
      await new Promise((r) => setTimeout(r, 2000))
      // Click on the Gas Tank option
      await clickOnElement(newPage, feeToken)
    }
  }
  // Click on "Ape" button
  await clickOnElement(newPage, '[data-testid="fee-ape:"]')
  /* Click on "Sign" button */
  await clickOnElement(newPage, '[data-testid="transaction-button-sign"]')
  // Wait for the 'Timestamp' text to appear twice on the page
  await newPage.waitForFunction(
    () => {
      const pageText = document.documentElement.innerText
      const occurrences = (pageText.match(/Timestamp/g) || []).length
      return occurrences >= 2
    },
    { timeout: 250000 }
  )

  const doesFailedExist = await newPage.evaluate(() => {
    const pageText = document.documentElement.innerText
    return pageText.includes('failed') || pageText.includes('dropped')
  })

  await new Promise((r) => setTimeout(r, 300))

  expect(doesFailedExist).toBe(false) // This will fail the test if 'Failed' exists

  const currentURL = await newPage.url()

  // Split the URL by the '=' character and get the transaction hash
  const parts = currentURL.split('=')
  const transactionHash = parts[parts.length - 1]

  // console.log(`transaction hash is: ${transactionHash}`)
  try {
    //  Define the RPC URL for the Polygon network
    const rpcUrl = 'https://invictus.ambire.com/polygon'

    // Create a provider instance using the JsonRpcProvider
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    // Get transaction receipt
    const receipt = await provider.getTransactionReceipt(transactionHash)

    if (receipt.status === 1) {
    } else {
      console.log(`Transaction failed! Hash: ${transactionHash}`)
      expect(receipt.status).to.equal(1) // Assertion to fail the test if transaction failed
    }
  } catch (error) {
    // Handle any errors that occur during the transaction retrieval
    console.error('Error transaction status:', error, `TRANSACTION HASH: ${transactionHash}`)
  }
}
