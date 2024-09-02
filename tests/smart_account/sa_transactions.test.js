import { bootstrapWithStorage } from '../common-helpers/bootstrapWithStorage'
import { saParams } from '../config/constants'

import {
  makeValidTransaction,
  makeSwap,
  sendFundsGreaterThanBalance,
  sendFundsToSmartContract,
  signMessage
} from '../common/transactions'

describe('sa_transactions', () => {
  let browser
  let page
  let extensionURL
  let recorder
  beforeEach(async () => {
    ;({ browser, page, extensionURL, recorder } = await bootstrapWithStorage(
      'sa_transactions',
      saParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Make valid transaction', async () => {
    await makeValidTransaction(page, extensionURL, browser, {
      feeToken:
        '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000matic"]'
    })
  })

  it('Make valid swap ', async () => {
    await makeSwap(page, extensionURL, browser, {
      feeToken:
        '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000matic"]'
    })
  })
  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send MATIC tokens greater than the available balance ', async () => {
    await sendFundsGreaterThanBalance(page, extensionURL)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send MATIC tokens to smart contract ', async () => {
    await sendFundsToSmartContract(page, extensionURL)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Sign message', async () => {
    await signMessage(page, extensionURL, browser, process.env.SA_SELECTED_ACCOUNT)
  })
})
