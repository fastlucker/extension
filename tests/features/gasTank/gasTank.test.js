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

  it('Should top up Gas Tank with 0.000001 ETH on Base and pay with Gas Tank', async () => {
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

  it('Should test Confetti modal on first cashback', async () => {
    const client = await serviceWorker.client

    await mockPortfolioResponse(client, MOCK_RESPONSE)

    await clickOnElement(page, SELECTORS.refreshButton)
    await wait(CONFETTI_MODAL_WAIT_TIME)

    await clickOnElement(page, SELECTORS.refreshButton)
    await clickOnElement(page, SELECTORS.bannerButtonOpen)
    await clickOnElement(page, SELECTORS.confettiModalActionButton, true, 500)
  })

  it('Should check if all the data in the Gas Tank modal exists', async () => {
    await page.waitForSelector(SELECTORS.dashboardGasTankButton)

    // Click on 'Discover Gas Tank' button
    await clickOnElement(page, SELECTORS.dashboardGasTankButton)

    // Get all the divs in the modal, then returns only the number values of them
    const numberValues = await page.evaluate(() => {
      const numbers = Array.from(document.querySelectorAll('div[data-testid="bottom-sheet"] div'))
        .flatMap((el) => el.textContent.match(/-?\d+(\.\d+)?/g) || [])
        .map((num) => parseFloat(num))

      return Array.from(new Set(numbers))
    })

    // Check if the numbers are exact 3 (Balance, saved and cashback)
    expect(numberValues.length).toEqual(3)

    // Check if the numbers are equal or greater than 0
    numberValues.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0)
    })
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

  it('Should check if Gas Tank is disabled for Basic Account', async () => {
    await page.waitForSelector(SELECTORS.dashboardGasTankButton)

    const gasTankButtonText = await page.$eval(
      SELECTORS.dashboardGasTankButton,
      (el) => el.innerText
    )

    expect(gasTankButtonText).toBe('Discover Gas Tank')
  })

  it('Should check if top up Gas Tank functionality is disabled', async () => {
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

  it("Should click on 'Discover Gas Tank' then click on 'Create smart account' button", async () => {
    await page.waitForSelector(SELECTORS.dashboardGasTankButton)

    // Click on 'Discover Gas Tank' button
    await clickOnElement(page, SELECTORS.dashboardGasTankButton)

    // Click on 'Ok, create Smart Account' button in Gas Tank modal
    await clickOnElement(page, SELECTORS.createSmartAccountGasTankModalButton, true, 500)

    // Check if account adder bottom sheet is visible
    await page.waitForSelector(SELECTORS.importExistingWallet, { visible: true, timeout: 1000 })
  })
})
