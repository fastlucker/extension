/* eslint-disable import/no-unresolved */
import { baParams } from '../config/constants'
import { bootstrapWithStorage } from '../common-helpers/bootstrapWithStorage'
import { clickOnElement } from '../common-helpers/clickOnElement'
import { monitorRequests } from '../common/requests'
import {
  makeValidTransaction,
  checkTokenBalanceClickOnGivenActionInDashboard
} from '../common/transactions'
import { buildSelector } from '../common-helpers/buildSelector'
import { SELECTORS } from '../common/selectors/selectors'

describe('Test the stability of the extension', () => {
  let browser
  let page
  let recorder
  let extensionURL
  let serviceWorker

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL, serviceWorker } = await bootstrapWithStorage(
      'monitor_requests',
      baParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  const polTokenSelector = buildSelector('token-0x0000000000000000000000000000000000000000-polygon')

  it('Should load and refresh portfolio with a bad Polygon RPC', async () => {
    await monitorRequests(
      serviceWorker.client,
      async () => {
        await clickOnElement(page, '[data-testid="refresh-button"]')
        const bannerText = 'Failed to retrieve network data for Polygon'
        const rpcErrorBanner = await page.evaluate(() => {
          const banners = document.querySelectorAll('[data-testid="dashboard-error-banner"]')

          const banner = Array.from(banners).find((b) => b.innerText.includes(bannerText))

          return banner ? banner.innerText : ''
        })

        expect(rpcErrorBanner).toBeDefined()
      },
      {
        blockRequests: ['invictus.ambire.com/polygon']
      }
    )
  })
  it('Should be able to broadcast a transaction on Polygon with a bad Ethereum RPC', async () => {
    await monitorRequests(
      serviceWorker.client,
      async () => {
        await checkTokenBalanceClickOnGivenActionInDashboard(
          page,
          polTokenSelector,
          SELECTORS.tokenSend
        )
        await makeValidTransaction(page, extensionURL, browser)
      },
      {
        blockRequests: ['invictus.ambire.com/ethereum']
      }
    )
  })
  it('Should fail gracefully if the RPC is down before broadcast', async () => {
    await monitorRequests(
      serviceWorker.client,
      async () => {
        await checkTokenBalanceClickOnGivenActionInDashboard(
          page,
          polTokenSelector,
          SELECTORS.tokenSend
        )
        await makeValidTransaction(page, extensionURL, browser, {
          shouldStopBeforeSign: true
        })
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })

        const errorToastText = 'Failed to estimate account op'

        const errorToast = await page.locator(`//*[contains(text(), "${errorToastText}")]`)

        expect(errorToast).toBeDefined()
      },
      {
        blockRequests: ['invictus.ambire.com/polygon']
      }
    )
  })
  // TODO: Write more tests that block velcro, the relayer and maybe more RPCs
})
