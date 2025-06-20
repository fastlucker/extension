import { DEF_KEYSTORE_PASS, NEW_KEYSTORE_PASSWORD, saParams } from 'constants/env'

import { test } from '../../fixtures/pageObjects'

test.describe('keystore', () => {
  test.beforeEach(async ({ settingsPage }) => {
    await settingsPage.init(saParams)
  })

  test.only('should lock keystore', async ({ settingsPage }) => {
    await settingsPage.lockKeystore()
  })

  test('should unlock keystore', async ({ settingsPage }) => {
    await settingsPage.unlockKeystore()
  })
})
