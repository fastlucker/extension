// eslint-disable-next-line import/no-unresolved
import wait from '@ambire-common/utils/wait'

function getBackgroundRequestsByType(requests) {
  // -- Native token price requests
  const nativeTokenPriceRequests = requests.filter((request) => request.includes('/simple/price'))
  // -- ERC20 token price requests
  const batchedErc20TokenPriceRequests = requests.filter((request) =>
    request.includes('/simple/token_price')
  )
  // Hints requests
  const hintsRequests = requests.filter((request) => request.includes('/multi-hints'))
  // RPC requests
  const rpcRequests = requests.filter((request) => request.includes('invictus'))

  return {
    nativeTokenPriceRequests,
    batchedErc20TokenPriceRequests,
    hintsRequests,
    rpcRequests
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

  while (!lastRequestTime || Date.now() - lastRequestTime < maxTimeBetweenRequests) {
    // eslint-disable-next-line no-await-in-loop
    await wait(300)
  }

  await client.off('Fetch.requestPaused')

  return httpRequests
}

export { monitorRequests, getBackgroundRequestsByType }
