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
    await makeValidTransaction(page, extensionURL, browser)
  })

  // skip the test because Uniswap is temp broken on Polygon
  it('Make valid swap ', async () => {
    await makeSwap(page, extensionURL, browser)
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
