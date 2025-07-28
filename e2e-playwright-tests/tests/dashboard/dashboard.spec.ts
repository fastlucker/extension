import { saParams } from 'constants/env'
import { test } from 'fixtures/pageObjects'
import { pages } from 'pages/utils/page_instances'

test.describe('dashboard', () => {
  test.beforeEach(async () => {
    await pages.initWithStorage(saParams)
  })

  test.afterEach(async ({ context }) => {
    await context.close()
  })

  test('should have balance on the dashboard', async () => {
    await pages.dashboardPage.checkBalanceInAccount()
  })

  test('should test if expected tokens are visible on the dashboard', async () => {
    await pages.dashboardPage.checkIfTokensExist()
  })

  test('should test if expected NFTs are visible on the dashboard', async () => {
    await pages.dashboardPage.checkCollectibleItem()
  })
})
