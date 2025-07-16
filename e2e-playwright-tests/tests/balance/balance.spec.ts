import { baParams, saParams } from 'constants/env'
import tokens from 'constants/tokens'
import { test } from 'fixtures/pageObjects'

test.describe('Basic Acc - Token balance test', { tag: '@balanceCheck' }, async () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.init(baParams)
  })

  test('check balance of test tokens', async ({ dashboardPage }) => {
    const walletBase = tokens.wallet.base
    const usdcBase = tokens.usdc.base
    const usdcOP = tokens.usdc.optimism
    const usdceOP = tokens.usdce.optimism
    const daiOP = tokens.dai.optimism
    const xwalletETH = tokens.xwallet.ethereum

    const tokensList = [walletBase, usdcBase, usdcOP, usdceOP, daiOP, xwalletETH]

    // collect errors if any
    const errors: string[] = []

    await test.step('Check balance of Gas tank', async () => {
      const gasTankBalance = await dashboardPage.getCurrentBalance()

      if (gasTankBalance < 15) {
        const msg = `⚠️ Gas Tank balance is only ${gasTankBalance} USDC. Top it up.`
        errors.push(msg)
      }
    })

    await test.step('Check balance for tokens used in tests', async () => {
      const results = []

      for (let i = 0; i < tokensList.length; i++) {
        const token = tokensList[i]
        const result = await dashboardPage.checkTokenBalance(token)
        results.push(result)
      }

      const failed = results.filter((r) => r.error)

      if (failed.length > 0) {
        console.warn('\n⚠️ Some tokens are underfunded.')
        failed.forEach(({ error }) => {
          console.warn(` - ${error}`)
          errors.push(error)
        })
      }
    })

    if (errors.length > 0) {
      throw new Error(`Test failed with ${errors.length} issues:\n${errors.join('\n')}`)
    } else {
      console.log('✅ BA Tokens and gas tank have sufficient balance.')
    }
  })
})

test.describe('Smart Acc - Token balance test', { tag: '@balanceCheck' }, async () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.init(saParams)
  })

  test.only('check balance of test tokens', async ({ dashboardPage }) => {
    const walletBase = tokens.wallet.base
    const usdcBase = tokens.usdc.base
    const usdcOP = tokens.usdc.optimism
    const usdceOP = tokens.usdce.optimism
    const daiOP = tokens.dai.optimism
    const xwalletETH = tokens.xwallet.ethereum

    const tokensList = [walletBase, usdcBase, usdcOP, usdceOP, daiOP, xwalletETH]

    // collect errors if any
    const errors: string[] = []

    await test.step('Check balance of Gas tank', async () => {
      const gasTankBalance = await dashboardPage.getCurrentBalance()

      if (gasTankBalance < 5) {
        const msg = `⚠️ Gas Tank balance is only ${gasTankBalance} USDC. Top it up.`
        errors.push(msg)
      }
    })

    await test.step('Check balance for tokens used in tests', async () => {
      const results = []

      for (let i = 0; i < tokensList.length; i++) {
        const token = tokensList[i]
        const result = await dashboardPage.checkTokenBalance(token)
        results.push(result)
      }

      const failed = results.filter((r) => r.error)

      if (failed.length > 0) {
        console.warn('\n⚠️ Some tokens are underfunded.')
        failed.forEach(({ error }) => {
          console.warn(` - ${error}`)
          errors.push(error)
        })
      }
    })

    if (errors.length > 0) {
      throw new Error(`Test failed with ${errors.length} issues:\n${errors.join('\n')}`)
    } else {
      console.log('✅ SA Tokens and gas tank have sufficient balance.')
    }
  })
})
