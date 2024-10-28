import { SELECTORS } from '../../common/selectors/selectors'
import { saParams } from '../../config/constants'
import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { SMART_ACC_VIEW_ONLY_ADDRESS } from '../../constants/constants'

import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../../common/transactions.js'

const polTokenSelector = SELECTORS.nativeTokenPolygonDyn
const dashboardSendBtn = SELECTORS.tokenSend
const dashboardTopUpAction = SELECTORS.topUpButton

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
    await browser.close()
  })

  it('should build a transfer request to an address from the address book', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(page, polTokenSelector, dashboardSendBtn)

    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true,
      shouldUseAddressBookRecipient: true
    })
  })

  it('should build a transfer request to an unknown address', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(page, polTokenSelector, dashboardSendBtn)
    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true
    })
  })

  it('should not allow to build a transfer request with an amount exceeding the available token balance', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(page, polTokenSelector, dashboardSendBtn)
    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true,
      shouldSendButtonBeDisabled: true,
      tokenAmount: '22222'
    })
  })

  it('should build a top-up gas tank request', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      polTokenSelector,
      dashboardTopUpAction
    )

    await makeValidTransaction(page, extensionURL, browser, {
      recipient: SMART_ACC_VIEW_ONLY_ADDRESS,
      feeToken:
        '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000pol"]',
      shouldStopBeforeSign: true,
      shouldSendButtonBeDisabled: true,
      tokenAmount: '0.0001',
      shouldTopUpGasTang: true
    })
  })
})
