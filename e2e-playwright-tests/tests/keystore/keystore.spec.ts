import { baParams, KEYSTORE_PASS } from 'constants/env'
import { pages } from 'pages/utils/page_instances'

import { test } from '../../fixtures/pageObjects'

test.describe('keystore', () => {
  test.beforeEach(async () => {
    await pages.initWithStorage(baParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('should lock keystore', async () => {
    await pages.settingsPage.lockKeystore()
  })

  test('should unlock keystore', async () => {
    await pages.settingsPage.unlockKeystore()
  })

  test('should change keystore password', async () => {
    const newPass = 'B1234566'

    await test.step('go to Extension pass page', async () => {
      await pages.settingsPage.openExtensionPassword()
    })
    await test.step('change current password', async () => {
      await pages.settingsPage.changeKeystorePassword(KEYSTORE_PASS, newPass)
    })
  })
})
