import { DEF_KEYSTORE_PASS, NEW_KEYSTORE_PASSWORD, saParams } from 'constants/env'

import { test } from '../../fixtures/pageObjects'

test.describe('keystore', () => {
  test.beforeEach(async ({ settingsPage }) => {
    await settingsPage.init(saParams)
  })

  test('should lock keystore', async ({ settingsPage }) => {
    await settingsPage.lockKeystore()
  })

  test('should unlock keystore', async ({ settingsPage }) => {
    await settingsPage.unlockKeystore()
  })

  test('should change keystore password', async ({ settingsPage }) => {
    await test.step('go to Extension pass page', async () => {
      await settingsPage.openExtensionPassword()
    })
    await test.step('change current password', async () => {
      await settingsPage.changeKeystorePassword(DEF_KEYSTORE_PASS, NEW_KEYSTORE_PASSWORD)
    })
    await test.step('return password to previous password', async () => {
      await settingsPage.changeKeystorePassword(NEW_KEYSTORE_PASSWORD, DEF_KEYSTORE_PASS)
    })
  })
})
