import { bootstrapWithStorage, saParams } from '../functions.js'

import {
  makeValidTransaction,
  makeSwap,
  sendFundsGreaterThanBalance,
  sendFundsToSmartContract,
  signMessage
} from '../common/transactions.js'

describe('sa_transactions', () => {
  let browser
  let page
  let extensionRootUrl
  let recorder
  beforeEach(async () => {
    ;({ browser, page, extensionRootUrl, recorder } = await bootstrapWithStorage(
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
    await makeValidTransaction(page, extensionRootUrl, browser)
  })

  // Exclude the SWAP test for now, as it occasionally fails. We'll reintroduce it once we've made improvements.
  it('Make valid swap ', async () => {
    await makeSwap(page, extensionRootUrl, browser)
  })
  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send MATIC tokens greater than the available balance ', async () => {
    await sendFundsGreaterThanBalance(page, extensionRootUrl)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send MATIC tokens to smart contract ', async () => {
    await sendFundsToSmartContract(page, extensionRootUrl)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Sign message', async () => {
    await signMessage(page, extensionRootUrl, browser, process.env.SA_SELECTED_ACCOUNT)
  })
})
