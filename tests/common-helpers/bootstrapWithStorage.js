import { bootstrap } from './bootstrap'
import { typeSeedPhrase } from './typeSeedPhrase'

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
