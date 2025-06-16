import { bootstrapWithStorage } from '../common-helpers/bootstrapWithStorage'
import { baParams } from '../config/constants'

import {
  sendFundsGreaterThanBalance,
  sendFundsToSmartContract,
  signMessage
} from '../common/transactions.js'

describe('ba_transactions', () => {
  let browser
  let page
  let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage(
      'ba_transactions',
      baParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('(-) Sends POL tokens greater than the available balance', async () => {
    await sendFundsGreaterThanBalance(page, extensionURL)
  })

  it('(-) Sends POL tokens to a smart contract', async () => {
    await sendFundsToSmartContract(page, extensionURL)
  })

  it('Signs a message', async () => {
    await signMessage(page, extensionURL, browser, baParams.envSelectedAccount)
  })
})
