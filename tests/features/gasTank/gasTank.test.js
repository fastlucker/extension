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
import { checkBalanceOfToken } from '../../common-helpers/checkBalanceOfToken'

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

  it('Top up Gas Tank with 0.0001 ETH on Base and pay with Gas Tank', async () => {
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

  it('The topping up Gas Tank functionality should be disabled', async () => {
    await page.waitForFunction(() => window.location.href.includes('/dashboard'))

    // Check ths balance of the selected token if it's lower than 'minBalance' and throws an error if it is
    await checkBalanceOfToken(page, SELECTORS.nativeTokenBaseDashboard, 0.0001)

    // Click on the token, which opens the modal with actions
    await clickOnElement(page, SELECTORS.nativeTokenBaseDashboard)

    const ariaDisabledValue = await page.$eval(SELECTORS.topUpButton, (el) =>
      el.getAttribute('data-tooltip-id')
    )

    expect(ariaDisabledValue).toBe('tooltip-top-up')
  })
})
