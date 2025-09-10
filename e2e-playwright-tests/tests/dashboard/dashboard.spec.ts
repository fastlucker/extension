import { saParams } from 'constants/env'
import selectors from 'constants/selectors'
import tokens from 'constants/tokens'
import { test } from 'fixtures/pageObjects'

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
    // SA should have 5 tokens on Base network - wallet, usdc, usdt, eth, clBtc
    const wallet = tokens.wallet.base
    const usdc = tokens.usdc.base
    const usdt = tokens.usdt.base
    const eth = tokens.eth.base
    const clBtc = tokens.clbtc.base

    await test.step('search by network - Base', async () => {
      await pages.dashboard.search('Base')
    })

    await test.step('assert search result', async () => {
      await pages.basePage.isVisible(`token-balance-${wallet.address}.${wallet.chainId}`)
      await pages.basePage.isVisible(`token-balance-${usdc.address}.${usdc.chainId}`)
      await pages.basePage.isVisible(`token-balance-${usdt.address}.${usdt.chainId}`)
      await pages.basePage.isVisible(`token-balance-${eth.address}.${eth.chainId}`)
      await pages.basePage.isVisible(`token-balance-${clBtc.address}.${clBtc.chainId}`)

      // 5 items should be visible for SA
      await pages.basePage.expectItemsCount(selectors.dashboard.networkBase, 5)
    })
  })

  test('Filter Tokens by token name', async ({ pages }) => {
    // SA should have 4 tokens containing USDC - base/optimism/polygon, USDCe - optimism
    const usdcMainnet = tokens.usdc.optimism
    const usdcBase = tokens.usdc.base
    const usdcEMainnet = tokens.usdce.optimism
    const usdcPolygon = tokens.usdc.polygon

    await test.step('search by token name - USDC', async () => {
      await pages.dashboard.search('USDC')
    })

    await test.step('assert search result', async () => {
      await pages.basePage.isVisible(`token-balance-${usdcMainnet.address}.${usdcMainnet.chainId}`)
      await pages.basePage.isVisible(`token-balance-${usdcBase.address}.${usdcBase.chainId}`)
      await pages.basePage.isVisible(
        `token-balance-${usdcEMainnet.address}.${usdcEMainnet.chainId}`
      )
      await pages.basePage.isVisible(`token-balance-${usdcPolygon.address}.${usdcPolygon.chainId}`)
    })

    // 4 items should be visible for SA
    await pages.basePage.expectItemsCount(selectors.dashboard.tokenUSDC, 3)
    await pages.basePage.expectItemsCount(selectors.dashboard.tokenUSDCe, 1)
  })
})
