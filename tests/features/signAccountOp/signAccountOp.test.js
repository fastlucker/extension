import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { baParams, saParams } from '../../config/constants'
import { SELECTORS } from '../../common/selectors/selectors'

import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../../common/transactions.js'

describe('sign_account_op_ba', () => {
  let browser
  let page
  let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage(
      'sign_account_op_ba',
      baParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it.skip('Should sign and broadcast an account op with Basic Account', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenPolygonDyn,
      SELECTORS.tokenSend
    )
    await makeValidTransaction(page, extensionURL, browser, {
      // TODO: should be false
      // shouldStopBeforeSign: false
      // shouldStopBeforeSign: true,
      // TODO: remove hardcoded address
      recipient: '0x4C71d299f23eFC660b3295D1f631724693aE22Ac'
    })
  })
})

describe('sign_account_op_sa', () => {
  let browser
  let page
  let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage(
      'sign_account_op_sa',
      saParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('Should sign and broadcast an account op with Smart Account, Should add to the queue a couple of transactions and then remove some of them. Should broadcast a (batched) account op with an EOA', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenPolygonDyn,
      SELECTORS.tokenSend
    )
    await makeValidTransaction(page, extensionURL, browser, {
      shouldUseAddressBookRecipient: true,
      shouldQueueAndSignLater: true
    })

    await makeValidTransaction(page, extensionURL, browser, {
      shouldUseAddressBookRecipient: true,
      shouldQueueAndSignLater: true
    })

    await makeValidTransaction(page, extensionURL, browser, {
      feeToken:
        '[data-testid="option-0x630fd7f359e483c28d2b0babde1a6f468a1d649e0x0000000000000000000000000000000000000000pol"]',
      shouldUseAddressBookRecipient: true,
      shouldRemoveTxnFromQueue: true
    })
  })

  it('Should sign and broadcast an account op with Smart Account,Should pay with Gas Tank', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenPolygonDyn,
      SELECTORS.tokenSend
    )

    await makeValidTransaction(page, extensionURL, browser, {
      feeToken:
        '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000polgastank"]',
      shouldStopBeforeSign: true,
      shouldUseAddressBookRecipient: true
    })
  })

  it('Should change account op transaction speed(s) and should reject an account op', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenPolygonDyn,
      SELECTORS.tokenSend
    )

    await makeValidTransaction(page, extensionURL, browser, {
      feeToken:
        '[data-testid="option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000polgastank"]',
      shouldChangeTxnSpeed: true,
      shouldUseAddressBookRecipient: true,
      shouldRejectTxn: true
    })
  })
})
