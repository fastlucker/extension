import { saParams } from '../../config/constants'
import { test } from '../../fixtures/pageObjects' // your extended test with authPage

test.describe.parallel('swapAndBridgePage Smart Account', () => {
  test.beforeEach(async ({ swapAndBridgePage }) => {
    await swapAndBridgePage.init(saParams)
  })

  test('should switch tokens during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.openSwapAndBridge()
    await swapAndBridgePage.prepareSwapAndBridge(null, 'USDC', '8453', 'WALLET')
    await swapAndBridgePage.switchTokensOnSwapAndBridge()
  })

  test('should do MAX token "From" amount during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.verifySendMaxTokenAmount('DAI', '10')
    await swapAndBridgePage.verifySendMaxTokenAmount('USDC', '8453')
  })
})
