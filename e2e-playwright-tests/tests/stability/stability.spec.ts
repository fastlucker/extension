import { baParams } from 'constants/env'
import { expect } from '@playwright/test'
import { test } from '../../fixtures/pageObjects'

test.describe('stability', () => {
  test.beforeEach(async ({ stabilityPage }) => {
    await stabilityPage.init(baParams)
  })

  test('RPC fail: Should load and refresh portfolio with a bad Polygon RPC', async ({
    stabilityPage
  }) => {
    const page = stabilityPage.page
    await page.getByTestId('balance-affecting-error-icon').click()

    const rpcErrorBanner = page
      .getByTestId('portfolio-error-alert')
      .filter({ hasText: 'Failed to retrieve network data for Polygon' })
      .first()

    await expect(rpcErrorBanner).toBeVisible()
  })
})
