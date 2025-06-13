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

  test('should find token that already exists within the "Receive" list during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.verifyDefaultReceiveToken('USDC', '8453', 'WALLET')
    await swapAndBridgePage.verifyDefaultReceiveToken('WALLET', '8453', 'LINK')
  })

  test('should import a token by address that is NOT in the default "Receive" list during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.verifyNonDefaultReceiveToken('ETH', '1', 'wCRES')
  })

  test('should "reject" (ie cancel) Swap & Bridge from the Pending Route component with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.openSwapAndBridge()
    await swapAndBridgePage.prepareSwapAndBridge(0.8, 'USDC', '8453', 'WALLET')
    await swapAndBridgePage.rejectTransaction()
  })

  test('should "proceed" Swap & Bridge from the Pending Route component with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.openSwapAndBridge()
    await swapAndBridgePage.prepareSwapAndBridge(0.8, 'USDC', '8453', 'WALLET')
    await swapAndBridgePage.proceedTransaction()
  })

  test('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.switchUSDValueOnSwapAndBridge('USDC.E', '10', 0.34)
    await swapAndBridgePage.switchUSDValueOnSwapAndBridge('DAI', '10', 0.2)
    await swapAndBridgePage.switchUSDValueOnSwapAndBridge('USDC', '8453', 0.012)
    await swapAndBridgePage.switchUSDValueOnSwapAndBridge('xWALLET', '1', 1)
    await swapAndBridgePage.switchUSDValueOnSwapAndBridge('DAI', '10', 0.51)
    await swapAndBridgePage.switchUSDValueOnSwapAndBridge('xWALLET', '1', 0.9)
  })

  test('should auto-refresh active route after 60s during Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.prepareSwapAndBridge(0.009, 'USDC', '8453', 'WALLET')
    await swapAndBridgePage.verifyAutoRefreshRoute()
  })

  test('should select a different route when Swap & Bridge with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.prepareSwapAndBridge(0.009, 'USDC', '8453', 'WALLET')
    await swapAndBridgePage.clickOnSecondRoute()
  })

  test('should Bridge tokens with a Smart Account', async ({ swapAndBridgePage }) => {
    await swapAndBridgePage.prepareBridgeTransaction(0.0063, 'USDC', '8453', '10')
    await swapAndBridgePage.signTokens()
  })

  test.only('should batch Swap of ERC20 tokens and Native to ERC20 token with a Smart Account', async ({
    swapAndBridgePage
  }) => {
    await swapAndBridgePage.prepareSwapAndBridge(0.003, 'WALLET', '8453', 'USDC')
    await swapAndBridgePage.batchAction()
    await swapAndBridgePage.prepareSwapAndBridge(0.002, 'USDC', '8453', 'ETH')
    await swapAndBridgePage.batchActionWithSign()
  })
})
