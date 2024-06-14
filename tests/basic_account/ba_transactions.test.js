import { bootstrapWithStorage, baParams } from '../functions.js'

import {
  makeValidTransaction,
  makeSwap,
  sendFundsGreaterThatBalance,
  sendFundsToSmartContract,
  signMessage
} from '../common.js'

describe('ba_transactions', () => {
  let browser
  let page
  let extensionRootUrl
  let recorder

  beforeEach(async () => {
    const context = await bootstrapWithStorage('ba_transactions', baParams)
    browser = context.browser
    page = context.page
    recorder = context.recorder
    extensionRootUrl = context.extensionRootUrl
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
  it('(-) Send matics greater than the available balance ', async () => {
    await sendFundsGreaterThatBalance(page, extensionRootUrl)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send matics to smart contract ', async () => {
    await sendFundsToSmartContract(page, extensionRootUrl)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Sign message', async () => {
    await signMessage(page, extensionRootUrl, browser, process.env.BA_SELECTED_ACCOUNT)
  })
})
