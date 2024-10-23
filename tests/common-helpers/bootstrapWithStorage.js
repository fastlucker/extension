import { bootstrap } from './bootstrap'
import { typeKeystorePassAndUnlock } from './typeKeystorePassAndUnlock'
import { DEF_KEYSTORE_PASS } from '../config/constants'

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
  const { browser, page, recorder, extensionURL, serviceWorker } = await bootstrap(namespace)

  const storageParamsMapped = {
    accountPreferences: storageParams.parsedKeystoreAccountsPreferences,
    accounts: storageParams.parsedKeystoreAccounts,
    isDefaultWallet: storageParams.parsedIsDefaultWallet,
    keyPreferences: storageParams.parsedKeyPreferences,
    networkPreferences: storageParams.parsedNetworkPreferences,
    networksWithAssetsByAccount: storageParams.parsedNetworksWithAssetsByAccount,
    onboardingState: storageParams.parsedOnboardingState,
    permission: storageParams.envPermission,
    previousHints: storageParams.parsedPreviousHints,
    selectedAccount: storageParams.envSelectedAccount,
    termsState: storageParams.envTermState,
    tokenIcons: storageParams.parsedTokenItems,
    invite: storageParams.invite,
    isE2EStorageSet: true,
    isPinned: 'true',
    isSetupComplete: 'true',
    ...(!shouldUnlockKeystoreManually && {
      keyStoreUid: storageParams.parsedKeystoreUID,
      keystoreKeys: storageParams.parsedKeystoreKeys,
      keystoreSecrets: storageParams.parsedKeystoreSecrets
    })
  }

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
      await recorder.stop()
      await browser.close()

      process.exit(1)
    }
  }

  return { browser, extensionURL, page, recorder, serviceWorker }
}
