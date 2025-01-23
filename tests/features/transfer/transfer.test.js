import { saParams } from '../../config/constants'
import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { SMART_ACC_VIEW_ONLY_ADDRESS } from '../../constants/constants'
import {
  SEND_TOKEN_SELECTOR,
  DASHBOARD_SEND_BTN_SELECTOR,
  DASHBOARD_TOP_UP_BTN_SELECTOR,
  FEE_TOKEN_POL_SELECTOR,
  BIG_AMOUNT
} from './constants'

import {
  prepareTransaction,
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
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
    await browser.close()
  })

  it('should build a transfer request to an address from the address book', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SEND_TOKEN_SELECTOR,
      DASHBOARD_SEND_BTN_SELECTOR
    )

    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true,
      shouldUseAddressBookRecipient: true
    })
  })

  it('should build a transfer request to an unknown address', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SEND_TOKEN_SELECTOR,
      DASHBOARD_SEND_BTN_SELECTOR
    )
    await makeValidTransaction(page, extensionURL, browser, {
      shouldStopBeforeSign: true
    })
  })

  it('should not allow to build a transfer request with an amount exceeding the available token balance', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SEND_TOKEN_SELECTOR,
      DASHBOARD_SEND_BTN_SELECTOR
    )
    await prepareTransaction(page, SMART_ACC_VIEW_ONLY_ADDRESS, BIG_AMOUNT, {
      shouldSendButtonBeDisabled: true
    })
  })

  it('should build a top-up gas tank request', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SEND_TOKEN_SELECTOR,
      DASHBOARD_TOP_UP_BTN_SELECTOR
    )

    await makeValidTransaction(page, extensionURL, browser, {
      recipient: SMART_ACC_VIEW_ONLY_ADDRESS,
      feeToken: FEE_TOKEN_POL_SELECTOR,
      shouldStopBeforeSign: true,
      shouldTopUpGasTank: true
    })
  })
})
