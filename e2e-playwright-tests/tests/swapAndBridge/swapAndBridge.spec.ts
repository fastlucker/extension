import { saParams } from '../../config/constants'
import tokens from '../../constants/tokens'
import { test } from '../../fixtures/pageObjects' // your extended test with authPage

test.describe.parallel('swapAndBridgePage Smart Account', () => {
  test.beforeEach(async ({ swapAndBridgePage }) => {
    await swapAndBridgePage.init(saParams)
  })

  test('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    const fromToken = tokens.dai.optimism
    const toToken = tokens.usdce.optimism

    await swapAndBridgePage.prepareSwapAndBridge(0.1, fromToken, toToken)
    await swapAndBridgePage.enterNumber('00.01', true)
  })

  test('should accept amount starting with point like ".01" during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    const fromToken = tokens.dai.optimism
    const toToken = tokens.usdce.optimism

    await swapAndBridgePage.prepareSwapAndBridge(0.1, fromToken, toToken)
    await swapAndBridgePage.enterNumber('.01', true)
  })

  test('should not accept chars as amount during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    const fromToken = tokens.dai.optimism
    const toToken = tokens.usdce.optimism

    await swapAndBridgePage.prepareSwapAndBridge(0.1, fromToken, toToken)
    await swapAndBridgePage.enterNumber('abc', true)
  })

  test('should switch tokens during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    const fromToken = tokens.usdc.base
    const toToken = tokens.wallet.base

    await swapAndBridgePage.openSwapAndBridge()
    await swapAndBridgePage.prepareSwapAndBridge(null, fromToken, toToken)
    await swapAndBridgePage.switchTokensOnSwapAndBridge()
  })

  test('should do MAX token "From" amount during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    const dai = tokens.dai.optimism
    const usdc = tokens.usdc.base

    await swapAndBridgePage.verifySendMaxTokenAmount(dai)
    await swapAndBridgePage.verifySendMaxTokenAmount(usdc)
  })
})
