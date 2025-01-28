import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams, baParams } from '../../config/constants'
import { SELECTORS } from '../../common/selectors/selectors'
import { buildFeeTokenSelector } from '../signAccountOp/functions'
import { USDC_TOKEN_SELECTOR } from '../signAccountOp/constants'
import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../../common/transactions'
import { clickOnElement } from '../../common-helpers/clickOnElement'
import { MOCK_RESPONSE, GAS_TANK_TOP_UP_AMOUNT, CONFETTI_MODAL_WAIT_TIME } from './constants'
import { wait } from '../auth/functions'
import { mockPortfolioResponse } from './functions'

describe('Gas Tank tests with Smart Account', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  const feeTokenWithGasTankSelector = buildFeeTokenSelector(
    saParams.envSelectedAccount,
    USDC_TOKEN_SELECTOR,
    true
  )

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL, serviceWorker } = await bootstrapWithStorage(
      'gas_tank_sa',
      saParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('Top up gas tank with 0.0001 ETH on Base and pay with Gas Tank', async () => {
    await checkTokenBalanceClickOnGivenActionInDashboard(
      page,
      SELECTORS.nativeTokenBaseDashboard,
      SELECTORS.topUpButton
    )

    await makeValidTransaction(page, extensionURL, browser, {
      tokenAmount: GAS_TANK_TOP_UP_AMOUNT,
      feeToken: feeTokenWithGasTankSelector,
      shouldTopUpGasTank: true
    })
  })

  it('Test Confetti modal on first cashback', async () => {
    const client = await serviceWorker.client

    await mockPortfolioResponse(client, MOCK_RESPONSE)

    await clickOnElement(page, SELECTORS.refreshButton)
    await wait(CONFETTI_MODAL_WAIT_TIME)

    await clickOnElement(page, SELECTORS.refreshButton)
    await clickOnElement(page, SELECTORS.bannerButtonOpen)
    await clickOnElement(page, SELECTORS.confettiModalActionButton, true, 500)
  })
})

describe('Gas Tank tests with Basic Account', () => {
  let browser
  let page
  // let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('gas_tank_ba', baParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('Check if Gas Tank is disabled for Basic Account', async () => {
    await page.waitForSelector(SELECTORS.dashboardGasTankButton)

    const gasTankButtonText = await page.$eval(
      SELECTORS.dashboardGasTankButton,
      (el) => el.innerText
    )

    expect(gasTankButtonText).toBe('Discover Gas Tank')
  })
})
