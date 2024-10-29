import { bootstrapWithStorage } from '../common-helpers/bootstrapWithStorage'
import { baParams } from '../config/constants'
import { SELECTORS } from '../common/selectors/selectors'

import {
  makeSwap,
  sendFundsGreaterThanBalance,
  sendFundsToSmartContract,
  signMessage,
  checkTokenBalanceClickOnGivenActionInDashboard
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
    await signMessage(page, extensionURL, browser, process.env.BA_SELECTED_ACCOUNT)
  })

  describe('Swap', () => {
    // Swap tests fail occasionally (2 out of 10 times in CI) because Uniswap can't switch the network to Polygon.
    // We traced the RPC requests but couldn't identify any failing ones.
    // Since the swap is managed by Uniswap, it is difficult to debug exactly what is happening.
    // Considering that this failure is only observed in CI mode,
    // we have decided to stop investigating the issue and instead re-run the test if it fails.
    jest.retryTimes(3)

    it('Makes a valid swap', async () => {
      await makeSwap(page, extensionURL, browser, { shouldStopBeforeSign: true })
    })
  })
})
