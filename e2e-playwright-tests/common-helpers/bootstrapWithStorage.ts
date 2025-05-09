import { DEF_KEYSTORE_PASS } from '../config/constants'
import { bootstrap } from './bootstrap'
import { typeKeystorePassAndUnlock } from './typeKeystorePassAndUnlock'

//----------------------------------------------------------------------------------------------
/**
 * Bootstraps the application with storage settings.
 *
 * @param {string} namespace - The namespace to be used.
 * @param {Object} storageParams - Parameters to configure storage.
 * @param {boolean} [shouldUnlockKeystoreManually=false] - If true, the keystore must be unlocked manually.
 *
 * @returns {Promise<void>} - A promise that resolves once the operation completes.
 */
export async function bootstrapWithStorage(
  namespace,
  storageParams,
  shouldUnlockKeystoreManually = false
) {
  // Initialize browser and page using bootstrap
  const { page, extensionURL, serviceWorker } = await bootstrap(namespace)
  /* ToDo Migration: commented out for now
  const { browser, page, recorder, extensionURL, serviceWorker } = await bootstrap(namespace)
  */

  const {
    parsedKeystoreAccounts: accounts,
    parsedNetworksWithAssetsByAccount: networksWithAssetsByAccount,
    parsedNetworksWithPositionsByAccount: networksWithPositionsByAccounts,
    parsedOnboardingState: onboardingState,
    parsedPreviousHints: previousHints,
    envSelectedAccount: selectedAccount,
    envTermState: termsState,
    invite,
    parsedKeystoreUID: keyStoreUid,
    parsedKeystoreKeys: keystoreKeys,
    parsedKeystoreSecrets: keystoreSecrets,
    parsedKeystoreSeeds: keystoreSeeds,
    ...rest
  } = storageParams

  const storageParamsMapped = {
    accounts,
    networksWithAssetsByAccount,
    networksWithPositionsByAccounts,
    onboardingState,
    previousHints,
    selectedAccount,
    termsState,
    invite,
    isE2EStorageSet: true,
    isPinned: 'true',
    isSetupComplete: 'true',
    ...(!shouldUnlockKeystoreManually && {
      keyStoreUid,
      keystoreKeys,
      keystoreSecrets
    }),
    ...rest
  }

  // Wait until chrome.storage.local becomes available
  let isReady = false
  for (let i = 0; i < 50; i++) {
    isReady = await serviceWorker.evaluate(() => {
      // @ts-expect-error: chrome is injected by the browser
      return typeof chrome !== 'undefined' && !!chrome.storage?.local
    })

    if (isReady) break
    await new Promise(res => setTimeout(res, 100))
  }
  if (!isReady) {
    throw new Error('❌ chrome.storage.local was never available in service worker')
  }
  // @ts-expect-error: chrome is injected by the browser
  await serviceWorker.evaluate((params) => chrome.storage.local.set(params), storageParamsMapped)

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
  if (!shouldUnlockKeystoreManually) {
    try {
      // Navigate to a specific URL if necessary
      await page.goto(`${extensionURL}/tab.html#/keystore-unlock`, { waitUntil: 'load' })

      await typeKeystorePassAndUnlock(page, DEF_KEYSTORE_PASS)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }
  /* ToDo Migration: commented out for now
  return { browser, extensionURL, page, recorder, serviceWorker }
  */
  return { extensionURL, page, serviceWorker }
}
