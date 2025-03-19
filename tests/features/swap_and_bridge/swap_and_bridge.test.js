/* eslint-disable no-await-in-loop */
import { baParams, saParams } from '../../config/constants'
import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { clickOnElement } from '../../common-helpers/clickOnElement'

import {
  selectButton,
  openSwapAndBridge,
  enterNumber,
  prepareSwapAndBridge,
  openSwapAndBridgeActionPage,
  batchActionPage,
  signActionPage,
  verifyIfSwitchIsActive,
  switchTokensOnSwapAndBridge,
  switchUSDValueOnSwapAndBridge,
  prepareBridgeTransaction,
  clickOnSecondRoute,
  changeRoutePriority,
  verifySendMaxTokenAmount,
  verifyNonDefaultReceiveToken,
  verifyDefaultReceiveToken
} from './functions'

describe('Swap & Bridge transactions with a Basic Account', () => {
  let browser
  let page
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('swapAndBridgeBA', baParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  afterAll(async () => {
  })

  it('should Swap ERC20 tokens USDC to WALLET on Base network with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should Swap ERC20 tokens WALLET to USDC on Base network with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.85, 'WALLET', 'base', 'USDC')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    await enterNumber(page, '00.01', true)
  })

  it('should accept amount starting with point like ".01" during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    await enterNumber(page, '.01', true)
  })

  it('should not accept chars as amount during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    await enterNumber(page, 'abc', true)
  })

  it('should Bridge tokens with a Basic Account', async () => {
    const text = await prepareBridgeTransaction(page, '0.06', 'USDC', 'base', 'optimism')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should "proceed" Swap & Bridge from the Pending Route component with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    let actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 3000 })
    actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, 'Proceed')
    )
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 3000 })
  })

  it('should "reject" (ie cancel) Swap & Bridge from the Pending Route component with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    const actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
    await selectButton(page, 'Cancel')
    await expect(page).not.toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
  })

  it('should select a different route when Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    await clickOnSecondRoute(page)
  })

  it('should switch tokens during Swap & Bridge with a Basic Account', async () => {
    await openSwapAndBridge(page)
    await verifyIfSwitchIsActive(page, false)
    await prepareSwapAndBridge(page, null, 'USDC', 'base', 'WALLET')
    await verifyIfSwitchIsActive(page, true)
    await switchTokensOnSwapAndBridge(page)
  })

  it('should switch tokens 12x during Swap & Bridge with a Basic Account', async () => {
    await openSwapAndBridge(page)
    await verifyIfSwitchIsActive(page, false)
    await prepareSwapAndBridge(page, null, 'USDC', 'base', 'WALLET')
    await verifyIfSwitchIsActive(page, true)
    for (let i = 1; i <= 12; i++) {
      await switchTokensOnSwapAndBridge(page, 300)
    }
  })

  it('should do MAX token "From" amount during Swap & Bridge with a Basic Account', async () => {
    await verifySendMaxTokenAmount(page, 'DAI', 'optimism')
    await verifySendMaxTokenAmount(page, 'USDC', 'base')
    await verifySendMaxTokenAmount(page, 'xWALLET', 'ethereum')
  })

  it('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Basic Account', async () => {
    await switchUSDValueOnSwapAndBridge(page, 'WALLET', 'base', 1)
    await switchUSDValueOnSwapAndBridge(page, 'USDC', 'base', 0.012)
    await switchUSDValueOnSwapAndBridge(page, 'DAI', 'optimism', 0.02)
    // POL: await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.3)
    await switchUSDValueOnSwapAndBridge(page, 'ETH', 'ethereum', 0.0004)
    await switchUSDValueOnSwapAndBridge(page, 'ETH', 'ethereum', 0.0001)
    await switchUSDValueOnSwapAndBridge(page, 'xWALLET', 'ethereum', 1)
    // POL: await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.25)
    await switchUSDValueOnSwapAndBridge(page, 'WALLET', 'base', 4.5)
  })

  it('should import a token by address that is NOT in the default "Receive" list during Swap & Bridge with a Basic Account', async () => {
    await verifyNonDefaultReceiveToken(page, 'ETH', 'ethereum', 'wCRES')
    await verifyNonDefaultReceiveToken(page, 'ETH', 'ethereum', 'GLQ')
    // POL: await verifyNonDefaultReceiveToken(page, 'POL', 'polygon', 'AMUSDC')
  })

  it('should find token that already exists within the "Receive" list during Swap & Bridge with a Basic Account', async () => {
    await verifyDefaultReceiveToken(page, 'USDC', 'base', 'WALLET')
    await verifyDefaultReceiveToken(page, 'WALLET', 'base', 'USDC')
    // await verifyDefaultReceiveToken(page, 'ETH', 'optimism', 'DAI')
  })

  it('should be able to change route priority from highest return to fastest transfer and vise-versa during Swap & Bridge with a Basic Account', async () => {
    // Use Fastest Transfer route
    await changeRoutePriority(page, 'Fastest Transfer')
    let text = await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    let actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await selectButton(actionPage, 'Reject')
    await selectButton(page, 'Back')

    // Use Highest Return route
    await changeRoutePriority(page, 'Highest Return')
    text = await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await selectButton(actionPage, 'Reject')
    await selectButton(page, 'Back')
  })
})

describe('Swap & Bridge transactions with a Smart Account', () => {
  let browser
  let page
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('swapAndBridgeSA', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  afterAll(async () => {
  })

  it('should batch Swap of ERC20 tokens and Native to ERC20 token with a Smart Account', async () => {
    let text = await prepareSwapAndBridge(page, 0.03, 'WALLET', 'base', 'USDC')
    // Get receive amount of the first transaction
    const reverseAmount1 = 0.000324
    await batchActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
    text = await prepareSwapAndBridge(page, 0.02, 'USDC', 'base', 'ETH')
    // Get receive amount of the second transaction
    const reverseAmount2 = 0.000010453
    const actionPage = await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    await signActionPage(actionPage)
    actionPage.close() // To be able to run the reverse below

    // Reverese the above batch to recover tokens balances
    text = await prepareSwapAndBridge(page, reverseAmount1, 'USDC', 'base', 'WALLET')
    await batchActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
    text = await prepareSwapAndBridge(page, reverseAmount2, 'ETH', 'base', 'USDC')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    await enterNumber(page, '00.01', true)
  })

  it('should accept amount starting with point like ".01" during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    await enterNumber(page, '.01', true)
  })

  it('should not accept chars as amount during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    await enterNumber(page, 'abc', true)
  })
  // TODO: Test failling in pipeline, should be debbuuged
  it('should Bridge tokens with a Smart Account', async () => {
    const text = await prepareBridgeTransaction(page, '0.063', 'USDC', 'base', 'optimism')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should "proceed" Swap & Bridge from the Pending Route component with a Smart Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.1, 'USDC.E', 'optimism', 'DAI')
    let actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 3000 })
    actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, 'Proceed')
    )
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 3000 })
  })
  // TODO: Test failling in pipeline, should be debbuuged
  it('should "reject" (ie cancel) Swap & Bridge from the Pending Route component with a Smart Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.008, 'USDC', 'base', 'WALLET')
    const actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
    await selectButton(page, 'Cancel')
    await expect(page).not.toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
  })

  it('should select a different route when Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.009, 'USDC', 'base', 'WALLET')
    await clickOnSecondRoute(page)
  })

  it.skip('should auto-refresh active route on 60s during Swap & Bridge with a Smart Account', async () => {
    // TODO: Implement the test
  })

  it('should switch tokens during Swap & Bridge with a Smart Account', async () => {
    await openSwapAndBridge(page)
    await verifyIfSwitchIsActive(page, false)
    await prepareSwapAndBridge(page, null, 'USDC', 'base', 'WALLET')
    await verifyIfSwitchIsActive(page, true)
    await switchTokensOnSwapAndBridge(page)
  })

  it('should switch tokens 12x during Swap & Bridge with a Smart Account', async () => {
    await openSwapAndBridge(page)
    await verifyIfSwitchIsActive(page, false)
    await prepareSwapAndBridge(page, null, 'USDC', 'base', 'WALLET')
    await verifyIfSwitchIsActive(page, true)
    for (let i = 1; i <= 12; i++) {
      await switchTokensOnSwapAndBridge(page, 300)
    }
  })

  it('should do MAX token "From" amount during Swap & Bridge with a Smart Account', async () => {
    await verifySendMaxTokenAmount(page, 'DAI', 'optimism')
    await verifySendMaxTokenAmount(page, 'USDC', 'base')
    // POL: await verifySendMaxTokenAmount(page, 'POL', 'polygon')
  })
  
  it('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Smart Account', async () => {
    await switchUSDValueOnSwapAndBridge(page, 'USDC.E', 'optimism', 0.34)
    await switchUSDValueOnSwapAndBridge(page, 'DAI', 'optimism', 0.02)
    await switchUSDValueOnSwapAndBridge(page, 'USDC', 'base', 0.012)
    // POL: await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.3)
    await switchUSDValueOnSwapAndBridge(page, 'ETH', 'ethereum', 0.0004)
    await switchUSDValueOnSwapAndBridge(page, 'xWALLET', 'ethereum', 1)
    // POL: await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.24)
    await switchUSDValueOnSwapAndBridge(page, 'DAI', 'optimism', 0.51)
    await switchUSDValueOnSwapAndBridge(page, 'xWALLET', 'ethereum', 0.9)
  })

  it('should import a token by address that is NOT in the default "Receive" list during Swap & Bridge with a Smart Account', async () => {
    await verifyNonDefaultReceiveToken(page, 'ETH', 'ethereum', 'wCRES')
    await verifyNonDefaultReceiveToken(page, 'ETH', 'ethereum', 'GLQ')
    // POL: await verifyNonDefaultReceiveToken(page, 'POL', 'polygon', 'AMUSDC')
  })

  it('should find token that already exists within the "Receive" list during Swap & Bridge with a Smart Account', async () => {
    await verifyDefaultReceiveToken(page, 'USDC', 'base', 'WALLET')
    await verifyDefaultReceiveToken(page, 'WALLET', 'base', 'USDC')
    // await verifyDefaultReceiveToken(page, 'ETH', 'optimism', 'DAI')
  })

  it('should be able to change route priority from highest return to fastest transfer and vise-versa during Swap & Bridge with a Smart Account', async () => {
    // Use Fastest Transfer route
    await changeRoutePriority(page, 'Fastest Transfer')
    let text = await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    let actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await selectButton(actionPage, 'Reject')
    await selectButton(page, 'Back')

    // Use Highest Return route
    await changeRoutePriority(page, 'Highest Return')
    text = await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await selectButton(actionPage, 'Reject')
    await selectButton(page, 'Back')
  })
})
