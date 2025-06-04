import { expect } from '@playwright/test'
import { TEST_IDS } from '../../common/selectors/selectors'
import { saParams } from '../../config/constants'
import { test } from '../../fixtures/pageObjects'

test.describe('transfer', () => {
  test.beforeEach(async ({ transferPage }) => {
    await transferPage.init(saParams)
  })

  test('should send txn', async ({ transferPage }) => {
    const page = transferPage.page

    const sendButton = page.getByTestId(TEST_IDS.dashboardButtonSend)
    await sendButton.click()

    const tokensSelect = page.getByTestId(TEST_IDS.tokensSelect)
    await tokensSelect.click()

    // TODO - improve selector
    const token = page.getByTestId(
      'option-0x0b2c639c533813f4aa9d7837caf62653d097ff85.10.usdc.false..op-mainnet'
    )
    await token.click()

    const amountField = page.getByTestId(TEST_IDS.amountField)
    await amountField.fill('0.001')

    const addressField = page.getByTestId(TEST_IDS.addressEnsField)
    await addressField.fill('0x03C9c8264f4534614F919644EC6DBE727a2638C9')

    const checkbox = page.getByTestId(TEST_IDS.recipientAddressUnknownCheckbox)
    await checkbox.click()

    const proceedButton = page.getByTestId(TEST_IDS.proceedBtn)
    await proceedButton.click()

    // TODO - reusable test-id for both transfer and swap
    const sign = page.getByTestId('swap-button-sign')
    await sign.click()

    const txnStatus = await page.getByTestId('txn-status').textContent()

    expect(txnStatus).toEqual('Transfer done!')
  })
})
