import { BA_PASSPHRASE } from 'config/constants'

import { constants } from '../../constants/constants'
import { test } from '../../fixtures/pageObjects' // your extended test with authPage

test.describe('auth', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.init()
  })

  test('should import view-only Basic account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(constants.addresses.basicAccount)
  })

  test('should import view-only Smart account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(constants.addresses.smartAccount)
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
})
