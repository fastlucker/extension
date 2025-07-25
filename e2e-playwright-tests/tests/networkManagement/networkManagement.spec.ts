import { saParams } from 'constants/env'
import { pages } from 'pages/utils/page_instances'

import { test } from '../../fixtures/pageObjects'

test.describe('network management', () => {
  test.beforeEach(async () => {
    await pages.initWithStorage(saParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('adding network manually', async ({ settingsPage }) => {
    await settingsPage.addNetworkManually('FLR')
  })

  test('add, edit and disable network from Chainlist', async ({ settingsPage }) => {
    await settingsPage.addNetworkFromChainlist('FLOW')
    await settingsPage.editNetwork('FLOW')
    await settingsPage.disableNetwork()
  })
})
