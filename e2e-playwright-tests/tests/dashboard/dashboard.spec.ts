import { saParams } from 'constants/env'
import selectors from 'constants/selectors'
import { test } from 'fixtures/pageObjects'

import tokens from '../../constants/tokens'

test.describe('dashboard', () => {
  test.beforeEach(async ({ pages }) => {
    await pages.initWithStorage(saParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('should have balance on the dashboard', async ({ pages }) => {
    await pages.dashboard.checkBalanceInAccount()
  })

  test('should test if expected tokens are visible on the dashboard', async ({ pages }) => {
    await pages.dashboard.checkIfTokensExist()
  })

  test('should test if expected NFTs are visible on the dashboard', async ({ pages }) => {
    await pages.dashboard.checkCollectibleItem()
  })

  test('import whale account via ENS from Dashboard', async ({ pages }) => {
    await test.step('open add account modal from dashboard', async () => {
      await pages.basePage.click(selectors.accountSelectBtn)
      await pages.basePage.click(selectors.buttonAddAccount)
    })

    await test.step('import vitalik.eth account', async () => {
      await pages.settings.addReadOnlyAccount('vitalik.eth')
    })

    await test.step('naigate to dashboard and check view-only account', async () => {
      await pages.dashboard.navigateToDashboard()

      // assert account name
      await pages.basePage.compareText(selectors.accountSelectBtn, 'vitalik.eth')
    })
  })

  test('Filter Tokens by Network', async ({ pages }) => {
    await pages.auth.pause()
    await test.step('search by network - Base', async () => {
      await pages.dashboard.search('Base')
    })

    await test.step('assert search result', async () => {
      // 5 tokens should be visible on Base network - wallet, usdc, usdt, eth, clBtc
      await pages.basePage.expectItemsCount('Base', 5)
    })
  })
})
