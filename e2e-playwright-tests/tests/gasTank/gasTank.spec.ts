import { baParams } from '../../config/constants'
import tokens from '../../constants/tokens'
import { test } from '../../fixtures/pageObjects'

test.describe('gasTank - Basic Account', () => {
  test.beforeEach(async ({ gasTankPage }) => {
    await gasTankPage.init(baParams)
  })

  test.only('top up Gas Tank with 0.1$ on Base', async ({ gasTankPage }) => {
    const sendToken = tokens.usdc.base

    await gasTankPage.pause()
    const oldBalance = await gasTankPage.getCurrentBalance()
    await gasTankPage.topUpGasTank(sendToken, '0.1')
    const newBalance = await gasTankPage.getCurrentBalance()

    expect(oldBalance).toBeLessThan(newBalance)
  })
})
