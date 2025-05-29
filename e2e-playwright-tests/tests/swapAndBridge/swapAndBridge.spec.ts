import { saParams } from '../../config/constants'
import { test } from '../../fixtures/pageObjects' // your extended test with authPage

test.describe.parallel('swapAndBridgePage Smart Account', () => {
  test.beforeEach(async ({ swapAndBridgePage }) => {
    await swapAndBridgePage.init(saParams)
  })

  test('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.prepareSwapAndBridge(0.1, 'DAI', '10', 'USDC.E')
    await swapAndBridgePage.enterNumber('00.01', true)
  })

  test('should accept amount starting with point like ".01" during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.prepareSwapAndBridge(0.1, 'DAI', '10', 'USDC.E')
    await swapAndBridgePage.enterNumber('.01', true)
  })

  test('should not accept chars as amount during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.prepareSwapAndBridge(0.1, 'DAI', '10', 'USDC.E')
    await swapAndBridgePage.enterNumber('abc', true)
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
