import { expect } from '@playwright/test'
import { TEST_IDS } from '../../common/selectors/selectors'
import { saParams } from '../../config/constants'
import tokens from '../../constants/tokens'
import { test } from '../../fixtures/pageObjects'

test.describe('transfer', () => {
  test.beforeEach(async ({ transferPage }) => {
    await transferPage.init(saParams)
  })

  test('should send a transaction', async ({ transferPage }) => {
    const page = transferPage.page

    const sendButton = page.getByTestId(TEST_IDS.dashboardButtonSend)
    await sendButton.click()

    const tokensSelect = page.getByTestId(TEST_IDS.tokensSelect)
    await tokensSelect.click()

    await transferPage.clickOnMenuToken(tokens.usdc.optimism)

    const amountField = page.getByTestId(TEST_IDS.amountField)
    await amountField.fill('0.001')

    const addressField = page.getByTestId(TEST_IDS.addressEnsField)
    // This address is derived from SA testing account seed phrase
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    await addressField.fill(recipientAddress)

    const checkbox = page.getByTestId(TEST_IDS.recipientAddressUnknownCheckbox)
    await checkbox.click()

    const proceedButton = page.getByTestId(TEST_IDS.proceedBtn)
    await proceedButton.click()

    const sign = page.getByTestId(TEST_IDS.signButton)
    await sign.click()

    const txnStatus = await page.getByTestId(TEST_IDS.txnStatus).textContent()

    expect(txnStatus).toEqual('Transfer done!')
  })
})
