import { saParams } from 'constants/env'

import { test } from '../../fixtures/pageObjects'

test.describe('network management', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.initWithStorage(saParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('adding network manually', async ({ pages }) => {
    await pages.settingsPage.addNetworkManually('FLR')
  })

  test('add, edit and disable network from Chainlist', async ({ pages }) => {
    await pages.settingsPage.addNetworkFromChainlist('FLOW')
    await pages.settingsPage.editNetwork('FLOW')
    await pages.settingsPage.disableNetwork()
  })
})
