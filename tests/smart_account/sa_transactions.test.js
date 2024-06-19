import { bootstrapWithStorage, saParams } from '../functions.js'

import {
  makeValidTransaction,
  makeSwap,
  sendFundsGreaterThatBalance,
  sendFundsToSmartContract,
  signMessage
} from '../common/transactions.js'

let browser
let page
let extensionRootUrl
let recorder

describe('sa_transactions', () => {
  beforeEach(async () => {
    const context = await bootstrapWithStorage('sa_transactions', saParams)

    browser = context.browser
    page = context.page
    recorder = context.recorder
    extensionRootUrl = context.extensionRootUrl
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('Make valid transaction', async () => {
    await makeValidTransaction(page, extensionRootUrl, browser)
  })

  it('Make valid swap ', async () => {
    await makeSwap(page, extensionRootUrl, browser)
  })

  it('(-) Send matics greater than the available balance ', async () => {
    await sendFundsGreaterThatBalance(page, extensionRootUrl)
  })

  it('(-) Send matics to smart contract ', async () => {
    await sendFundsToSmartContract(page, extensionRootUrl)
  })

  it('Sign message', async () => {
    await signMessage(page, extensionRootUrl, browser, process.env.SA_SELECTED_ACCOUNT)
  })
})
