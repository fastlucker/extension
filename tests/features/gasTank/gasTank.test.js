import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'
import { SELECTORS } from '../../common/selectors/selectors'
import { buildFeeTokenSelector } from '../signAccountOp/functions'
import { USDC_TOKEN_SELECTOR } from '../signAccountOp/constants'
import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../../common/transactions.js'

// TODO: Fix the describe title
describe('Gas Tank tests', () => {
  let browser
  let page
  let extensionURL
  let recorder

  const feeTokenWithGasTankSelector = buildFeeTokenSelector(
    saParams.envSelectedAccount,
    USDC_TOKEN_SELECTOR,
    true
  )

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage('gas_tank', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it.skip('Top up gas tank with 0.0001 ETH on Base and pay with Gas Tank', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenBaseDashboard,
      SELECTORS.topUpButton
    )

    await makeValidTransaction(page, extensionURL, browser, {
      tokenAmount: '0.0001',
      feeToken: feeTokenWithGasTankSelector,
      shouldTopUpGasTank: true
    })
  })
})
