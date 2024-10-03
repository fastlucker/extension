import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'

import {
  makeValidTransaction,
  makeSwap,
  sendFundsGreaterThanBalance,
  sendFundsToSmartContract,
  signMessage
} from '../../common/transactions.js'

describe('transfer', () => {
  let browser
  let page
  let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage('transfer', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    // await browser.close()
  })

  // should not allow to build a transfer request with an amount exceeding the available token balance
  // should build a top-up gas tank request

  it('should build a transfer request to an address from the address book', async () => {
    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true,
      shouldUseAddressBookRecipient: true
    })
  })

  it('should build a transfer request to an unknown address', async () => {
    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true
    })
  })

  it('should not allow to build a transfer request with an amount exceeding the available token balance', async () => {
    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true,
      tokenAmount: '22222'
    })
  })
})
