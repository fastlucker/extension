import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder'

import { ethers, Network } from 'ethers'

const puppeteer = require('puppeteer')

const buildPath = process.env.WEBPACK_BUILD_OUTPUT_PATH || 'webkit-prod'

const puppeteerArgs = [
  `--disable-extensions-except=${__dirname}/../${buildPath}/`,
  `--load-extension=${__dirname}/${buildPath}/`,
  '--disable-features=DialMediaRouteProvider',

  // '--disable-features=ClipboardContentSetting',

  '--clipboard-write: granted',
  '--clipboard-read: prompt',
  '--detectOpenHandles',
  '--start-maximized',

  // We need this for running Puppeteer in Github Actions
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--font-render-hinting=none',
  '--ignore-certificate-errors',
  '--window-size=1920,1080'
]

/**
 * Log all page console.log messages.
 * The messages are sent as strings, as Puppeteer can't read more complex structures.
 */
async function serviceWorkerLogger(serviceWorker) {
  // Enable the logger, only if E2E_DEBUG is set to 'true'.
  // The same rule is applied in backgrounds.ts too.
  if (process.env.E2E_DEBUG !== 'true') return

  const CDPSessionClient = serviceWorker.client

  await CDPSessionClient.send('Console.enable')

  CDPSessionClient.on('Console.messageAdded', async ({ message: { text } }) => {
    try {
      // The controllers' state is sent as a stringified JSON with the jsonRich library,
      // which is why we need to parse it back.
      // It would be better to use jsonRich.parse here, but it's written in TypeScript, while all E2E test files are in pure JS.
      // So we made a compromise and copied the parsing function instead of refactoring all the tests.
      const parsed = JSON.parse(text, (key, value) => {
        if (value?.$bigint) {
          return BigInt(value.$bigint)
        }
        return value
      })
      console.log(parsed)
    } catch (e) {
      // We wrapped the parsing in a try/catch block because it's very likely that the string is not a JSON string.
      // In that case, the parsing will fail, and we will simply show the string message.
      console.log(text)
    }
  })
}

export async function bootstrap(namespace) {
  const browser = await puppeteer.launch({
    // devtools: true,
    slowMo: 10,

    headless: false,
    args: puppeteerArgs,
    defaultViewport: null,
    // DISPLAY variable is being set in tests.yml, and it's needed only for running the tests in Github actions.
    // It configures the display server and make the tests working in headful mode in Github actions.
    ...(process.env.DISPLAY && {
      env: { DISPLAY: process.env.DISPLAY }
    }),
    ignoreHTTPSErrors: true
  })

  const backgroundTarget = await browser.waitForTarget(
    (target) => target.type() === 'service_worker' && target.url().endsWith('background.js')
  )

  const partialExtensionUrl = backgroundTarget.url() || ''
  const [, , extensionId] = partialExtensionUrl.split('/')
  const extensionURL = `chrome-extension://${extensionId}`

  const serviceWorker = await backgroundTarget.worker()

  // Wait for the service worker to be activated.
  // Otherwise, the tests fail randomly, and we can't set the storage in `bootstrapWithStorage`,
  // as the storage in `serviceWorker.evaluate(() => chrome.storage)` hasn't initialized yet.
  // Before migrating to Manifest v3, it worked because the background page was always active (in contrast to service_worker).
  await serviceWorker.evaluate(() => {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-restricted-globals
      if (self.registration.active) {
        resolve()
      } else {
        // eslint-disable-next-line no-restricted-globals
        self.addEventListener('activate', resolve)
      }
    })
  })

  // If env.E2E_DEBUG is set to 'true', we log all controllers' state updates from the background page
  await serviceWorkerLogger(serviceWorker)

  const page = await browser.newPage()
  page.setDefaultTimeout(120000)
  // Make the extension tab active in the browser
  await page.bringToFront()

  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true
  })
  await recorder.start(`./recorder/${namespace}_${Date.now()}.mp4`)

  return {
    browser,
    page,
    recorder,
    extensionURL,
    serviceWorker
  }
}

// function for finding and clicking on a dom element
// by default the function will wait for the button element to become enabled in order to click on it
export async function clickOnElement(page, selector, waitUntilEnabled = true, clickDelay = 0) {
  const elementToClick = await page.waitForSelector(selector, { visible: true })

  const executeClick = async () => {
    if (clickDelay > 0) await new Promise((resolve) => setTimeout(resolve, clickDelay))
    if (!elementToClick) return
    try {
      return await elementToClick.click()
    } catch (error) {
      // sometimes the button is in the DOM and it is enabled but it is not in the area of the screen
      // where it can be clicked. In that case settings a small timeout before clicking works just fine
      // but a more reliable option is to use page.$eval
      await page.$eval(selector, (el) => el.click())
    }
  }

  const waitForClickable = async () => {
    const isClickable = await page.evaluate((selector) => {
      try {
        const buttonElement = document.querySelector(selector)
        return (
          !!buttonElement &&
          !buttonElement.disabled &&
          window.getComputedStyle(buttonElement).pointerEvents !== 'none'
        )
      } catch (error) {
        // Some Puppeteer selectors are not valid for querySelector.
        // In such cases, skip the enabled check and assume the button should be enabled.
        // This is because accessing the actual DOM element and checking its properties is not straightforward in that case
        return true
      }
    }, selector)

    if (isClickable === 'disabled') return

    if (isClickable) {
      return executeClick()
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
    await waitForClickable()
    return 'disabled'
  }

  if (waitUntilEnabled) {
    await waitForClickable()
  } else {
    await executeClick()
  }
}

//----------------------------------------------------------------------------------------------

export async function typeText(page, selector, text) {
  await page.waitForSelector(selector, { visible: true, timeout: 5000 })
  const whereToType = await page.$(selector)
  await whereToType.click({ clickCount: 3 })
  await whereToType.press('Backspace')
  await whereToType.type(text, { delay: 10 })
}

//----------------------------------------------------------------------------------------------
export async function typeSeedPhrase(page, seedPhrase) {
  await page.waitForSelector('[data-testid="passphrase-field"]')
  await typeText(page, '[data-testid="passphrase-field"]', seedPhrase)
  await clickOnElement(page, '[data-testid="button-unlock"]') // Click on "Unlock button"
  await page.waitForSelector('[data-testid="full-balance"]')
}

//----------------------------------------------------------------------------------------------
export const INVITE_STORAGE_ITEM = {
  status: 'VERIFIED',
  verifiedAt: 1715332416400,
  verifiedCode: 'dummy-test-code'
}

export const baParams = {
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
  const { browser, page, recorder, extensionURL, serviceWorker } = await bootstrap(namespace)
  await serviceWorker.evaluate(
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
        invite: params.invite,
        isE2EStorageSet: true
      }),
    params
  )

  /**
   * If something goes wrong with any of the functions below, e.g., `typeSeedPhrase`,
   * this `bootstrapWithStorage` won't return the expected object (browser, recorder, etc.),
   * and the CI will hang for a long time as the recorder won't be stopped in the `afterEach` block and will continue recording.
   * This is the message we got in such a case in the CI:
   *
   * 'Jest did not exit one second after the test run has completed.
   *  This usually means that there are asynchronous operations that weren't stopped in your tests.
   *  Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.'
   *
   * To prevent such long-lasting handles, we are catching the error and stopping the Jest process.
   */
  try {
    // Navigate to a specific URL if necessary
    await page.goto(`${extensionURL}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

    await typeSeedPhrase(page, process.env.KEYSTORE_PASS)
  } catch (e) {
    console.log(e)
    await recorder.stop()
    await browser.close()

    process.exit(1)
  }

  return { browser, extensionURL, page, recorder, serviceWorker }
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
  await clickOnElement(page, '[data-testid="keystore-button-continue"]', true, 1500)
}

//----------------------------------------------------------------------------------------------
export async function finishStoriesAndSelectAccount(page, shouldClickOnAccounts) {
  await page.waitForFunction(() => window.location.href.includes('/account-adder'))

  await clickOnElement(page, 'xpath///a[contains(text(), "Next")]', false, 1500)
  await clickOnElement(page, 'xpath///a[contains(text(), "Got it")]', false, 1500)

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
export async function triggerTransaction(page, extensionURL, browser, triggerTransactionSelector) {
  await clickOnElement(page, triggerTransactionSelector)

  const newTarget = await browser.waitForTarget((target) =>
    target.url().startsWith(`${extensionURL}/action-window.html#`)
  )
  const actionWindowPage = await newTarget.page()
  actionWindowPage.setDefaultTimeout(120000)
  actionWindowPage.setViewport({ width: 1300, height: 700 })

  // Start the screen recorder
  const transactionRecorder = new PuppeteerScreenRecorder(actionWindowPage, { followNewTab: true })
  await transactionRecorder.start(`./recorder/txn_action_window_${Date.now()}.mp4`)

  return { actionWindowPage, transactionRecorder }
}

//----------------------------------------------------------------------------------------------
export async function checkForSignMessageWindow(page, extensionURL, browser) {
  let actionWindowPage = page // Initialize actionWindowPage with the current page

  // Check if "sign-message" action-window is open
  if (actionWindowPage.url().endsWith('/sign-message')) {
    console.log('New window before transaction is open')
    // If the selector exists, click on it
    await actionWindowPage.click('[data-testid="button-sign"]')

    const newPagePromise2 = await browser.waitForTarget(
      (target) => target.url() === `${extensionURL}/action-window.html#/sign-account-op`
    )
    const newPageTarget = await newPagePromise2

    actionWindowPage = await newPageTarget.page()
    actionWindowPage.setDefaultTimeout(120000)
  }

  return { actionWindowPage }
}

//----------------------------------------------------------------------------------------------
export async function selectFeeToken(actionWindowPage, feeToken) {
  // Click on the tokens select
  await clickOnElement(actionWindowPage, '[data-testid="fee-option-select"]')

  // Select fee token
  await clickOnElement(actionWindowPage, feeToken)
}

//----------------------------------------------------------------------------------------------
export async function signTransaction(actionWindowPage, transactionRecorder) {
  actionWindowPage.setDefaultTimeout(120000)

  // Click on "Ape" button
  await clickOnElement(actionWindowPage, '[data-testid="fee-ape:"]')

  // Click on "Sign" button
  await clickOnElement(actionWindowPage, '[data-testid="transaction-button-sign"]')
  // Important note:
  // We found that when we run the transaction tests in parallel,
  // the transactions are dropping/failing because there is a chance two or more transactions will use the same nonce.
  // If this happens, one of the tests will fail occasionally.
  // Here are some such cases:
  // 1. Different PRs are running the E2E tests, or
  // 2. We run the tests locally and on the CI at the same time
  // Because of this, as a hotfix, we now just check if the `benzin` page is loaded, without waiting for a
  // transaction confirmation. Even in this case, we can still catch bugs, as on the SignAccountOp screen we are operating
  // with Simulations, Fees, and Signing.
  // We will research how we can rely again on the transaction receipt as a final step of confirming and testing a txn.
  await actionWindowPage.waitForFunction("window.location.hash.includes('benzin')")
  await transactionRecorder.stop()

  return

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

  // If it fails, the next expect will throw an error and the recorder at the end of the test won't finish recording.
  // Because of this, we make sure to stop it here in case of failure.
  if (doesFailedExist) {
    await transactionRecorder.stop()
  }

  expect(doesFailedExist).toBe(false) // This will fail the test if 'Failed' exists
}

//----------------------------------------------------------------------------------------------
export async function confirmTransactionStatus(
  actionWindowPage,
  networkName,
  chainID,
  transactionRecorder
) {
  const currentURL = await actionWindowPage.url()
  return
  // Split the URL by the '=' character and get the transaction hash
  const parts = currentURL.split('=')
  const transactionHash = parts[parts.length - 1]

  // Create a provider instance using the JsonRpcProvider
  const staticNetwork = Network.from(chainID)
  const provider = new ethers.JsonRpcProvider(
    `https://invictus.ambire.com/${networkName}`,
    staticNetwork,
    { staticNetwork }
  )

  // Get transaction receipt
  const receipt = await provider.getTransactionReceipt(transactionHash)

  await transactionRecorder.stop()

  console.log(`Transaction Hash: ${transactionHash}`)
  console.log('getTransactionReceipt result', receipt)
  // Assertion to fail the test if transaction failed
  expect(receipt.status).toBe(1)
}
export async function checkBalanceOfToken(page, tokenSelector, tokenMinimumBalance) {
  const tokenText = await page.$eval(tokenSelector, (element) => element.textContent)

  // Extract token balance and network
  const tokenBalance = parseFloat(tokenText.match(/^\d*\.?\d+/)[0])
  const tokenMatches = tokenText.match(/\s(.*?)\$/)

  const tokenAndNetwork = tokenMatches[1].trim()

  if (tokenBalance < tokenMinimumBalance) {
    throw new Error(`There is NOT enough funds, Balance: ${tokenBalance} ${tokenAndNetwork}`)
  }
}
