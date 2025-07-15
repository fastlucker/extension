import { BA_PASSPHRASE, KEYSTORE_PASS, SA_PASSPHRASE } from 'constants/env'
import mainConstants from 'constants/mainConstants'
import { test } from 'fixtures/pageObjects' // your extended test with authPage
import { expect } from '@playwright/test'
import { getController, setup, initTrezorConnect } from '../../utils/trezorEmulator'
import selectors from '../../constants/selectors'

export const TREZOR_EMULATOR_OPTIONS = {
  version: '1-main',
  model: 'T1B1',
  mnemonic: 'mnemonic_12',
  pin: '1234',
  passphrase_protection: false,
  label: 'Test Trezor Device',
  settings: {
    use_passphrase: false,
    experimental_features: true
  }
}

test.describe.parallel('auth', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.init()
  })

  test('should import view-only Basic account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(mainConstants.addresses.basicAccount)
  })

  test('should import view-only Smart account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(mainConstants.addresses.smartAccount)
  })

  test('create new basic account', async ({ authPage }) => {
    await authPage.createNewAccount()
  })

  test('import basic account from private key', async ({ authPage }) => {
    await authPage.importExistingAccount()
  })

  test('import one Basic Account from a 12 words seed phrase and personalize them', async ({
    authPage
  }) => {
    await authPage.importExistingAccountByRecoveryPhrase(BA_PASSPHRASE)
  })

  test('import one Smart Account from a 12 words seed phrase and personalize them', async ({
    authPage
  }) => {
    await authPage.importExistingAccountByRecoveryPhrase(SA_PASSPHRASE)
  })

  test('import a couple of view-only accounts (at once) and personalize some of them', async ({
    authPage
  }) => {
    await authPage.importCoupleOfViewOnlyAccount(
      mainConstants.addresses.basicAccount,
      mainConstants.addresses.smartAccount
    )
  })

  test('create a new hot wallet (Smart Account) by setting up a default seed phrase first, and afterward create a couple of more hot wallets (Smart Accounts) out of the stored seed phrase and personalize some of them', async ({
    authPage
  }) => {
    await authPage.createNewHotWalletAndPersonalizeName()
  })

  test('import account from different HD paths', async ({ authPage }) => {
    await authPage.createAccountAndImportFromDifferentHDPath()
  })

  test('import account from JSON file', async ({ authPage }) => {
    await authPage.importAccountFromJSONFile()
  })
})

test.describe('Trezor', () => {
  const controller = getController()

  test.beforeAll(async () => {
    await setup(controller, TREZOR_EMULATOR_OPTIONS)
    await initTrezorConnect(controller)
  })

  test.beforeEach(async ({ authPage }) => {
    await authPage.init()
  })

  test.afterAll(async () => {
    // Cleanup emulator and dispose of resources
    try {
      await controller.api.wipeEmu()
      await controller.api.stopBridge()
      await controller.api.stopEmu()
      controller.dispose()
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  })

  test('should successfully authenticate using Trezor', async ({ authPage }) => {
    const page = authPage.page

    await page.getByTestId('create-existing-account-btn').click()
    await page.getByTestId('import-method-trezor').click()

    await page.getByTestId(selectors.enterPassField).fill(KEYSTORE_PASS)
    await page.getByTestId(selectors.repeatPassField).fill(KEYSTORE_PASS)

    const trezorPage = await authPage.handleNewPage(
      page.getByTestId(selectors.createKeystorePassBtn)
    )

    await trezorPage.content()

    const locator = trezorPage.getByRole('button', { name: /I acknowledge and wish to/i })
    await locator.waitFor({ timeout: 5000 })
    if (await locator.isVisible()) {
      await locator.click()
    }

    await trezorPage.getByTestId('@analytics/continue-button').click()

    // Click on the device name
    await trezorPage.locator('button.list .wrapper .device-name').click()

    await trezorPage.getByRole('button', { name: 'Allow once for this session' }).click()
    await trezorPage.getByRole('button', { name: 'Export' }).click()

    await page.getByTestId('add-account-0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8').click()
    await page.getByTestId('add-account-0x4f4F1488ACB1Ae1b46146CEfF804f591dFe660ac').click()

    await page.getByTestId('button-import-account').click()
    await page.getByTestId('button-save-and-continue').click()

    await authPage.goToDashboard()

    await page.getByTestId('account-select-btn').click()

    await expect(page.getByText('0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8')).toBeVisible()
    await expect(page.getByText('0x4f4F1488ACB1Ae1b46146CEfF804f591dFe660ac')).toBeVisible()
  })
})
