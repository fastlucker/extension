import { baParams } from 'constants/env'
import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageObjects'
import { categorizeRequests } from '../../utils/requests'

test.describe('stability', () => {
  test.beforeEach(async ({ stabilityPage }) => {
    await stabilityPage.init(baParams)
  })

  test('RPC fail: Should load and refresh portfolio with a bad Polygon RPC', async ({
    stabilityPage
  }) => {
    await stabilityPage.blockRouteAndUnlock('**/invictus.ambire.com/polygon')
    const page = stabilityPage.page
    await page.getByTestId('balance-affecting-error-icon').click()

    const rpcErrorBanner = page.getByTestId('portfolio-error-alert')

    await expect(rpcErrorBanner).toBeVisible()
    await expect(rpcErrorBanner).toContainText('Failed to retrieve network data for Polygon')
  })

  test('Velcro fail: Should find tokens using previous hints; Should not display an error banner as there are cached hints', async ({
    stabilityPage
  }) => {
    await stabilityPage.blockRouteAndUnlock('**/relayer.ambire.com/velcro-v3/*')
    const page = stabilityPage.page

    // Tokens are found using previous hints
    // -- DAI on Arbitrum
    const daiToken = page.getByTestId('token-0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1-42161')
    await expect(daiToken).toBeVisible()

    // -- USDC on Optimism
    const usdcToken = page.getByTestId('token-0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85-10')
    await expect(usdcToken).toBeVisible()

    // -- WALLET on Ethereum
    const walletToken = page.getByTestId('token-0x88800092fF476844f74dC2FC427974BBee2794Ae-1')
    await expect(walletToken).toBeVisible()

    await page.getByTestId('balance-affecting-error-icon').click()

    const velcroErrorBanner = page.getByTestId('portfolio-error-alert')

    await expect(velcroErrorBanner).toBeVisible()
    await expect(velcroErrorBanner).toContainText(
      'Automatic asset discovery is temporarily unavailable'
    )
  })

  test('monitor fetch requests on Dashboard', async ({ stabilityPage }) => {
    const page = stabilityPage.page

    await stabilityPage.monitorRequests()

    await stabilityPage.unlock()

    // Wait for all requests to be triggered
    await page.waitForTimeout(10000)

    const categorized = stabilityPage.getCategorizedRequests()

    // ⚠️ Note: It's difficult to accurately track the exact number of requests being made,
    // as even minor changes (e.g. adding a new default network, cache misses, retries) can shift totals.
    // The expectations below are based on rough estimates and include some tolerance.
    // If any of them are exceeded significantly, it may signal a regression.
    // ---
    // Note on RPC requests:
    // Each network typically triggers 2 RPC calls.
    // So the total number of RPC requests scales linearly with the number of networks configured.
    // This is why the threshold here is intentionally higher to account for all supported networks.
    expect(categorized.rpc.length).toBeLessThanOrEqual(30)
    expect(categorized.hints.length).toBeLessThanOrEqual(1)
    expect(categorized.nativePrices.length).toBeLessThanOrEqual(10)
    expect(categorized.thirdParty.length).toBeLessThanOrEqual(10)
    expect(categorized.thirdParty.length).toBeLessThanOrEqual(10)
    expect(categorized.allowedUncategorized.length).toBeLessThanOrEqual(5)

    // ☢️ Critical: there should be no truly uncategorized requests.
    // Anything uncategorized is likely unexpected or suspicious.
    expect(categorized.uncategorized.length).toBeLessThanOrEqual(0)
  })
})
