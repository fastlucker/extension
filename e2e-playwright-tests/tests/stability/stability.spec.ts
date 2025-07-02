import { baParams } from 'constants/env'
import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageObjects'

test.describe('stability', () => {
  test.beforeEach(async ({ stabilityPage }) => {
    await stabilityPage.initLocked(baParams)
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
})
