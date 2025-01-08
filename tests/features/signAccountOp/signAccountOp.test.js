import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { baParams, saParams } from '../../config/constants'
import { SELECTORS } from '../../common/selectors/selectors'
import { buildFeeTokenSelector } from './functions'
import { POL_TOKEN_SELECTOR } from './constants'

import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../../common/transactions.js'

describe('Signing and broadcasting an account operation with a Basic Account', () => {
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

  it('Should sign and broadcast an account op with Basic Account', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenPolygonDyn,
      SELECTORS.tokenSend
    )
    await makeValidTransaction(page, extensionURL, browser, {
      recipient: saParams.envSelectedAccount
    })
  })
})

describe('Signing and broadcasting account operations with a Smart Account', () => {
  let browser
  let page
  let extensionURL
  let recorder

  const feeTokenWithEOASelector = buildFeeTokenSelector(
    baParams.envSelectedAccount,
    POL_TOKEN_SELECTOR
  )

  const feeTokenWithGasTankSelector = buildFeeTokenSelector(
    saParams.envSelectedAccount,
    POL_TOKEN_SELECTOR,
    true
  )

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
      feeToken: feeTokenWithEOASelector,
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
      feeToken: feeTokenWithGasTankSelector,
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
      feeToken: feeTokenWithGasTankSelector,
      shouldChangeTxnSpeed: true,
      shouldUseAddressBookRecipient: true,
      shouldRejectTxn: true
    })
  })
})
