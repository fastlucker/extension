/* eslint-disable no-await-in-loop */
import { baParams, saParams } from '../../config/constants'
import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { clickOnElement } from '../../common-helpers/clickOnElement'
import { SELECTORS } from '../../common/selectors/selectors'

import {
  checkIfOnDashboardPage,
  selectButton,
  openSwapAndBridge,
  enterNumber,
  prepareSwapAndBridge,
  openSwapAndBridgeActionPage,
  signActionPage,
  checkIfSwitchIsActive,
  switchTokensOnSwapAndBridge,
  switchUSDValueOnSwapAndBridge,
  bridgeBasicAccount,
  bridgeSmartAccount
} from './functions'

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
    const text = await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should Swap ERC20 tokens WALLET to USDC on Base network with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 1, 'WALLET', 'base', 'USDC')
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should be able to return back to Dashboard from Swap & Bridge page with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    await selectButton(page, 'Back')
    await checkIfOnDashboardPage(page)
  })

  it('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    await enterNumber(page, '00.01', true)
  })

  it('should accept amount starting with point like ".01" during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    // ToDo: It fails now. Deveopers to fix the issue with entering amount starting the point
    await enterNumber(page, '.01', true)
  })

  it('should not accept chars as amount during Swap & Bridge with a Basic Account', async () => {
    await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    await enterNumber(page, 'abc', true)
  })

  it('should Bridge tokens with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    await bridgeBasicAccount(page, 'USDC', 'base', 'optimism', SELECTORS.USDC)
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should "proceed" Swap & Bridge from the Pending Route component with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    let actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
    actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, 'Proceed')
    )
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
  })

  it('should "reject" (ie cancel) Swap & Bridge from the Pending Route component with a Basic Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.015, 'USDC', 'base', 'WALLET')
    const actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
    await selectButton(page, 'Cancel')
    await expect(page).not.toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
  })

  it.skip('should select a different route when Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should auto-refresh active route on 60s during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })
  // TODO: functions should be improved
  it.skip('should switch tokens during Swap & Bridge with a Basic Account', async () => {
    await openSwapAndBridge(page)
    await checkIfSwitchIsActive(page, false)
    await clickOnElement(page, 'text=Back')
    await prepareSwapAndBridge(page, null, 'USDC', 'base', 'WALLET')
    await checkIfSwitchIsActive(page, true)
    await switchTokensOnSwapAndBridge(page, 500)
  })
  // TODO: functions should be improved
  it.skip('should switch tokens 12x during Swap & Bridge with a Basic Account', async () => {
    await openSwapAndBridge(page)
    await checkIfSwitchIsActive(page, false)
    await clickOnElement(page, 'text=Back')
    await prepareSwapAndBridge(page, null, 'USDC', 'base', 'WALLET')
    await checkIfSwitchIsActive(page, true)
    for (let i = 1; i <= 12; i++) {
      await switchTokensOnSwapAndBridge(page, 250)
    }
  })

  it.skip('should do MAX token "From" amount during Swap & Bridge with a Basic Account', async () => {
    // ToDo: Implement the test
  })
  // TODO: functions should be improved
  it.skip('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Basic Account', async () => {
    await switchUSDValueOnSwapAndBridge(page, 'WALLET', 'base', 1)
    await switchUSDValueOnSwapAndBridge(page, 'USDC', 'base', 0.012)
    await switchUSDValueOnSwapAndBridge(page, 'DAI', 'optimism', 0.02)
    await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.3)
    await switchUSDValueOnSwapAndBridge(page, 'ETH', 'ethereum', 0.0004)
    await switchUSDValueOnSwapAndBridge(page, 'ETH', 'ethereum', 0.0001)
    await switchUSDValueOnSwapAndBridge(page, 'xWALLET', 'ethereum', 1)
    await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.25)
    await switchUSDValueOnSwapAndBridge(page, 'WALLET', 'base', 4.5)
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
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    await selectButton(page, 'Back')
    await checkIfOnDashboardPage(page)
  })

  it('should accept amount starting with zeros like "00.01" with during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    await enterNumber(page, '00.01', true)
  })

  it('should accept amount starting with point like ".01" during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    // ToDo: It fails now. Deveopers to fix the issue with entering amount starting the point
    await enterNumber(page, '.01', true)
  })

  it('should not accept chars as amount during Swap & Bridge with a Smart Account', async () => {
    await prepareSwapAndBridge(page, 0.1, 'DAI', 'optimism', 'USDC.E')
    await enterNumber(page, 'abc', true)
  })

  it('should Bridge tokens with a Smart Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.2, 'USDC', 'base', 'WALLET')
    await bridgeSmartAccount(page, 'USDC', 'base', 'optimism', SELECTORS.USDC)
    await signActionPage(
      await openSwapAndBridgeActionPage(page, (callback_page) => selectButton(callback_page, text))
    )
  })

  it('should "proceed" Swap & Bridge from the Pending Route component with a Smart Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.1, 'USDC.E', 'optimism', 'DAI')
    let actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
    actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, 'Proceed')
    )
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
  })

  it('should "reject" (ie cancel) Swap & Bridge from the Pending Route component with a Smart Account', async () => {
    const text = await prepareSwapAndBridge(page, 0.1, 'USDC.E', 'optimism', 'DAI')
    const actionPage = await openSwapAndBridgeActionPage(page, (callback_page) =>
      selectButton(callback_page, text)
    )
    await expect(actionPage).toMatchElement('div', { text: 'Transaction simulation' })
    actionPage.close()
    await expect(page).toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
    await selectButton(page, 'Cancel')
    await expect(page).not.toMatchElement('div', { text: 'Pending Route', timeout: 1000 })
  })

  it.skip('should select a different route when Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })

  it.skip('should auto-refresh active route on 60s during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })
  // TODO: functions should be improved
  it.skip('should switch tokens during Swap & Bridge with a Smart Account', async () => {
    await openSwapAndBridge(page)
    await checkIfSwitchIsActive(page, false)
    await clickOnElement(page, 'text=Back')
    await prepareSwapAndBridge(page, null, 'USDC.E', 'optimism', 'DAI')
    await checkIfSwitchIsActive(page, true)
    await switchTokensOnSwapAndBridge(page, 500)
  })
  // TODO: functions should be improved
  it.skip('should switch tokens 12x during Swap & Bridge with a Smart Account', async () => {
    await openSwapAndBridge(page)
    await checkIfSwitchIsActive(page, false)
    await clickOnElement(page, 'text=Back')
    await prepareSwapAndBridge(page, null, 'USDC.E', 'optimism', 'DAI')
    await checkIfSwitchIsActive(page, true)
    for (let i = 1; i <= 12; i++) {
      await switchTokensOnSwapAndBridge(page, 300)
    }
  })

  it.skip('should do MAX token "From" amount during Swap & Bridge with a Smart Account', async () => {
    // ToDo: Implement the test
  })
  // TODO: functions should be improved
  it.skip('should switch from token amount to USD value and vise-versa during Swap & Bridge with a Smart Account', async () => {
    await switchUSDValueOnSwapAndBridge(page, 'USDC.E', 'optimism', 0.34)
    await switchUSDValueOnSwapAndBridge(page, 'DAI', 'optimism', 0.02)
    await switchUSDValueOnSwapAndBridge(page, 'USDC', 'base', 0.012)
    await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.3)
    await switchUSDValueOnSwapAndBridge(page, 'ETH', 'ethereum', 0.0004)
    await switchUSDValueOnSwapAndBridge(page, 'xWALLET', 'ethereum', 1)
    await switchUSDValueOnSwapAndBridge(page, 'POL', 'polygon', 0.24)
    await switchUSDValueOnSwapAndBridge(page, 'DAI', 'optimism', 0.51)
    await switchUSDValueOnSwapAndBridge(page, 'xWALLET', 'ethereum', 0.9)
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
