import { baParams, saParams } from '../../config/constants'
import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'

import { prepareSwapAndBridge, proceedSwapAndBridge, enterNumber } from './functions'

describe('Swap & Bridge transactions with a Basic Account', () => {
  let browser
  let page
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('transfer', baParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  afterAll(async () => {
    // ToDo: revoke the approvals upon tests completion
  })

  it('should Swap ERC20 tokens USDC to WALLET on Base network with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'usdc', 'base', 'wallet')
    await proceedSwapAndBridge(page)
  })

  it('should Swap ERC20 tokens WALLET to USDC on Base network with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 1, 'wallet', 'base', 'usdc')
    await proceedSwapAndBridge(page)
  })

  it('should be able to return back to Dashboard from Swap & Bridge page with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'usdc', 'base', 'wallet')
    await enterNumber(page, '00.01', true)
  })

  it('should accept amount starting with point like ".01" during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'usdc', 'base', 'wallet')
    await enterNumber(page, '.01', true)
  })

  it('should not accept chars as amount during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'usdc', 'base', 'wallet')
    await enterNumber(page, 'abc', true)
  })

  it.skip('should Bridge tokens with a Basic Account', async () => {
    // ToDo: Implement the test
    // Consider testing the Dashboard banners (when bridging in progress) and the Route in Progress component
  })

  it.skip('should "proceed" and "reject" Swap & Bridge from the Pending Route component with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should select a different route when Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should auto-refresh active route on 60s during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should switch tokens during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should do MAX token "From" amount during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should import a token by address that is NOT in the default "Receive" list during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should find token that already exists within the "Receive" list during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test or assert a step in the other tests
  })

  it.skip('should be able to change route priority from highest return to fastest transfer and vise-versa during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })
})

describe('Swap & Bridge transactions with a Smart Account', () => {
  let browser
  let page
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('transfer', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  afterAll(async () => {
    // ToDo: revoke the approvals upon tests completion
  })

  it.skip('should batch Swap of ERC20 tokens and Native to ERC20 token with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it('should be able to return back to Dashboard from Swap & Bridge page with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'dai', 'optimism', 'usdc.e')
    await enterNumber(page, '00.01', true)
  })

  it('should accept amount starting with point like ".01" during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'dai', 'optimism', 'usdc.e')
    await enterNumber(page, '.01', true)
  })

  it('should not accept chars as amount during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'dai', 'optimism', 'usdc.e')
    await enterNumber(page, 'abc', true)
  })

  it.skip('should Bridge tokens with a Smart Account', async () => {
    // ToDo: Implement the test
    // Consider testing the Dashboard banners (when bridging in progress) and the Route in Progress component
  })

  it.skip('should "proceed" and "reject" Swap & Bridge from the Pending Route component with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should select a different route when Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should auto-refresh active route on 60s during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should switch tokens during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should do MAX token "From" amount during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should import a token by address that is NOT in the default "Receive" list during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should find token that already exists within the "Receive" list during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test or assert a step in the other tests
  })

  it.skip('should be able to change route priority from highest return to fastest transfer and vise-versa during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })
})
