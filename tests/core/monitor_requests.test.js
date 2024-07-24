/* eslint-disable import/no-unresolved */
import { networks } from '@ambire-common/consts/networks'
import { getBackgroundRequestsByType, monitorRequests } from '../common/requests.js'
import { makeValidTransaction } from '../common/transactions.js'
import { baParams, bootstrapWithStorage, clickOnElement } from '../functions.js'

describe('Monitor network requests and make sure only necessary requests are made', () => {
  let browser
  let page
  let recorder
  let serviceWorker
  let extensionURL

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

  it('portfolio and account state reload', async () => {
    const httpRequests = await monitorRequests(serviceWorker.client, async () => {
      await clickOnElement(page, '[data-testid="refresh-button"]')
    })

    const { nativeTokenPriceRequests, batchedErc20TokenPriceRequests, hintsRequests, rpcRequests } =
      getBackgroundRequestsByType(httpRequests)

    expect(nativeTokenPriceRequests.length).toBe(networks.length)

    expect(batchedErc20TokenPriceRequests.length).toBe(networks.length - 1)

    expect(hintsRequests.length).toBe(networks.length)

    expect(rpcRequests.length).toBeLessThanOrEqual(20)
  })

  it('sign account op request created through transfer', async () => {
    const httpRequests = await monitorRequests(serviceWorker.client, async () => {
      await makeValidTransaction(page, extensionURL, browser, {
        shouldStopBeforeSign: true
      })
    })

    const { rpcRequests, nativeTokenPriceRequests, batchedErc20TokenPriceRequests } =
      getBackgroundRequestsByType(httpRequests)

    const nonPolygonAndEthereumRpcRequests = rpcRequests.filter(
      (request) => !request.includes('polygon') && !request.includes('ethereum')
    )

    // Expect more rpc requests because of ENS/UD resolution
    // @TODO: check if we can reduce the number of requests
    expect(rpcRequests.length).toBeLessThanOrEqual(10)
    expect(nonPolygonAndEthereumRpcRequests.length).toBe(0)
    expect(nativeTokenPriceRequests.length).toBeLessThanOrEqual(2)
    expect(batchedErc20TokenPriceRequests.length).toBeLessThanOrEqual(2)
  })
})
