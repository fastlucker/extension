import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'
import { SELECTORS } from '../../common/selectors/selectors'
import { buildFeeTokenSelector } from '../signAccountOp/functions'
import { USDC_TOKEN_SELECTOR } from '../signAccountOp/constants'
import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../../common/transactions.js'

import { clickOnElement } from '../../common-helpers/clickOnElement'
import { MOCK_RESPONSE } from './constants'
import { wait } from '../auth/functions'

// TODO: Fix the describe title
describe('Gas Tank tests', () => {
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
      'gas_tank',
      saParams
    ))
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

  it('Test Confetti modal on first cashback', async () => {
    const client = await serviceWorker.client

    await client.send('Fetch.enable', {
      patterns: [{ urlPattern: '*', requestStage: 'Response' }]
    })

    let isMocked = false

    client.on('Fetch.requestPaused', async (event) => {
      if (!isMocked && event.request.url.includes('portfolio-additional')) {
        await client.send('Fetch.fulfillRequest', {
          requestId: event.requestId,
          responseCode: 200,
          responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
          body: Buffer.from(JSON.stringify(MOCK_RESPONSE)).toString('base64')
        })

        isMocked = true

        // Disable interception after the first request is mocked
        await client.send('Fetch.disable')
      } else {
        // Continue if it's not the request we want to mock or already mocked once
        await client.send('Fetch.continueRequest', { requestId: event.requestId })
      }
    })

    await clickOnElement(page, SELECTORS.refreshButton)

    // Wait until 'You just got receive your first cashback' modal pops up
    await wait(5000)

    await clickOnElement(page, SELECTORS.refreshButton)
    // Click on 'You've got cashback!' 'Open' button
    await clickOnElement(page, SELECTORS.bannerButtonOpen)
    // Click on 'Got it' button in 'You just got receive your first cashback' modal
    await clickOnElement(page, SELECTORS.confettiModalActionButton, true, 500)
  })
})
