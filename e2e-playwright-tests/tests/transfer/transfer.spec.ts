import { expect } from '@playwright/test'
import { TEST_IDS } from '../../common/selectors/selectors'
import { baParams } from '../../config/constants'
import tokens from '../../constants/tokens'
import { test } from '../../fixtures/pageObjects'

test.describe('transfer', () => {
  test.beforeEach(async ({ transferPage }) => {
    await transferPage.init(baParams)
  })

  test('should send a transaction and pay with the current account gas tank', async ({
    transferPage
  }) => {
    const sendToken = tokens.usdc.optimism
    // This address is derived from SA testing account seed phrase
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    const feeToken = tokens.usdc.ethereum
    const payWithGasTank = true

    await transferPage.send(sendToken, recipientAddress, feeToken, payWithGasTank)
  })

  test("should send a transaction and pay with the current account's ERC-20 token", async ({
    transferPage
  }) => {
    const sendToken = tokens.usdc.optimism
    // This address is derived from SA testing account seed phrase
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    const feeToken = tokens.usdc.optimism
    const payWithGasTank = false

    await transferPage.send(sendToken, recipientAddress, feeToken, payWithGasTank)
  })

  test('should batch multiple transfer transactions', async ({ transferPage }) => {
    const page = transferPage.page

    // Navigate to Transfer
    const sendButton = page.getByTestId(TEST_IDS.dashboardButtonSend)
    await sendButton.click()

    // Choose token
    const sendToken = tokens.usdc.optimism
    await transferPage.clickOnMenuToken(sendToken)

    // Amount
    const amountField = page.getByTestId(TEST_IDS.amountField)
    await amountField.fill('0.001')

    // Address
    const recipientAddress = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    await transferPage.fillRecipient(recipientAddress)

    // Batch
    const batchButton = page.getByTestId(TEST_IDS.batchBtn)
    await batchButton.click()
    const gotIt = page.getByTestId(TEST_IDS.batchModalGotIt)
    await gotIt.click()

    // Add More
    const addMoreButton = page.getByTestId('add-more-button')
    await addMoreButton.click()

    // Choose token
    const sendToken2 = tokens.usdc.optimism
    await transferPage.clickOnMenuToken(sendToken2)

    // Amount
    const amountField2 = page.getByTestId(TEST_IDS.amountField)
    await amountField2.fill('0.001')

    // Address
    const recipientAddress2 = '0xc162b2F9f06143Cf063606d814C7F38ED4471F44'
    await transferPage.fillRecipient(recipientAddress2)

    // Batch
    const batchButton2 = page.getByTestId(TEST_IDS.batchBtn)
    await batchButton2.click()
    const gotIt2 = page.getByTestId(TEST_IDS.batchModalGotIt)
    await gotIt2.click()

    // Go to Dashboard
    const goDashboardButton = page.getByTestId('go-dashboard-button')
    await goDashboardButton.click()

    // Open AccountOp screen
    await page.getByTestId('banner-button-open').first().click()

    const pages = page.context().pages()
    const actionWindowPage = pages.find((p) => p.url().includes('action-window.html'))

    await actionWindowPage.getByTestId('transaction-button-sign').click()

    // TODO - confirm Transaction
  })
})
