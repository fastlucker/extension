import { bootstrapWithStorage } from '../common-helpers/bootstrapWithStorage'
import { saParams } from '../config/constants'
import { SELECTORS } from '../common/selectors/selectors'

import {
  checkTokenBalanceClickOnGivenActionInDashboard,
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
  it('(-) Send POL tokens greater than the available balance ', async () => {
    await sendFundsGreaterThanBalance(page, extensionURL)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('(-) Send POL tokens to smart contract ', async () => {
    await sendFundsToSmartContract(page, extensionURL)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Sign message', async () => {
    await signMessage(page, extensionURL, browser, process.env.SA_SELECTED_ACCOUNT)
  })

  describe('Swap', () => {
    // Swap tests fail occasionally (2 out of 10 times in CI) because Uniswap can't switch the network to Polygon.
    // We traced the RPC requests but couldn't identify any failing ones.
    // Since the swap is managed by Uniswap, it is difficult to debug exactly what is happening.
    // Considering that this failure is only observed in CI mode,
    // we have decided to stop investigating the issue and instead re-run the test if it fails.
    jest.retryTimes(3)

    it('Make valid swap ', async () => {
      await makeSwap(page, extensionURL, browser, {
        feeToken:
          '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000pol"]',
        shouldStopBeforeSign: true
      })
    })
  })
})
