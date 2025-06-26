import { saParams } from 'constants/env'

import { test } from '../../fixtures/pageObjects'

test.describe('network management', () => {
  test.beforeEach(async ({ settingsPage }) => {
    await settingsPage.init(saParams)
  })

  test('adding network manually', async ({ settingsPage }) => {
    await settingsPage.addNetworkManually('FLR')
  })

  test('adding network from Chainlist', async ({ settingsPage }) => {
    // TODO:
  })
})
