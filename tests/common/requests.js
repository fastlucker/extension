// eslint-disable-next-line import/no-unresolved
import wait from '@ambire-common/utils/wait'

function getBackgroundRequestsByType(requests) {
  const nativeTokenPriceRequests = []
  const batchedErc20TokenPriceRequests = []
  const hintsRequests = []
  const rpcRequests = []
  const uncategorizedRequests = []

  requests.forEach((request) => {
    if (request.includes('/simple/price')) {
      nativeTokenPriceRequests.push(request)
      return
    }
    if (request.includes('/simple/token_price')) {
      batchedErc20TokenPriceRequests.push(request)
      return
    }
    if (request.includes('invictus')) {
      rpcRequests.push(request)
      return
    }
    if (request.includes('/multi-hints')) {
      hintsRequests.push(request)
      return
    }
    uncategorizedRequests.push(request)
  })

  return {
    nativeTokenPriceRequests,
    batchedErc20TokenPriceRequests,
    hintsRequests,
    rpcRequests,
    uncategorizedRequests
  }
}

async function monitorRequests(
  client,
  requestInducingFunction,
  { maxTimeBetweenRequests, throttleRequestsByMs } = {
    maxTimeBetweenRequests: 1000,
    throttleRequestsByMs: 0
  }
) {
  const httpRequests = []
  let lastRequestTime = null

  await client.send('Fetch.enable', {
    patterns: [
      {
        urlPattern: '*',
        requestStage: 'Response'
      }
    ]
  })

  client.on('Fetch.requestPaused', async ({ requestId, request }) => {
    httpRequests.push(request.url)
    lastRequestTime = Date.now()

    if (throttleRequestsByMs) await wait(throttleRequestsByMs)

    await client.send('Fetch.continueRequest', {
      requestId
    })
  })

  await requestInducingFunction()

  while (
    !lastRequestTime ||
    Date.now() - lastRequestTime < maxTimeBetweenRequests + throttleRequestsByMs
  ) {
    // eslint-disable-next-line no-await-in-loop
    await wait(300)
  }

  await client.off('Fetch.requestPaused')

  return httpRequests
}

export { monitorRequests, getBackgroundRequestsByType }
