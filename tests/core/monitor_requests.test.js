/* eslint-disable import/no-unresolved */
import { networks } from '@ambire-common/consts/networks'
import wait from '@ambire-common/utils/wait'
import { baParams, bootstrapWithStorage, clickOnElement } from '../functions.js'

describe('Monitor network requests and make sure only necessary requests are made', () => {
  let browser
  let page
  let recorder
  let serviceWorker
  let httpRequests = []

  beforeEach(async () => {
    ;({ browser, page, recorder, serviceWorker } = await bootstrapWithStorage(
      'monitor_requests',
      baParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
    httpRequests = []
  })

  it('portfolio and account state reload', async () => {
    const client = serviceWorker.client

    await client.send('Fetch.enable', {
      patterns: [
        {
          urlPattern: '*',
          requestStage: 'Response'
        }
      ]
    })
    await client.on('Fetch.requestPaused', async ({ requestId, request }) => {
      httpRequests.push(request.url)

      await client.send('Fetch.continueRequest', {
        requestId
      })
    })

    await clickOnElement(page, '[data-testid="refresh-button"]')
    await wait(6000)

    // Price requests

    // -- Native token price requests
    const nativeTokenPriceRequests = httpRequests.filter((request) =>
      request.includes('/simple/price')
    )

    expect(nativeTokenPriceRequests.length).toBe(networks.length)
    // -- ERC20 token price requests
    const batchedErc20TokenPriceRequests = httpRequests.filter((request) =>
      request.includes('/simple/token_price')
    )

    expect(batchedErc20TokenPriceRequests.length).toBe(networks.length - 1)

    // Hints requests
    const hintsRequests = httpRequests.filter((request) => request.includes('/multi-hints'))

    expect(hintsRequests.length).toBe(networks.length)
    // RPC requests

    const rpcRequests = httpRequests.filter((request) => request.includes('invictus'))

    expect(rpcRequests.length).toBeLessThanOrEqual(20)
  })
})
