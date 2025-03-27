// eslint-disable-next-line import/no-unresolved
import wait from '@ambire-common/utils/wait'

const RELAYER_HOST = 'relayer.ambire.com'
const CENA_HOST = 'cena.ambire.com'
const INVICTUS_HOST = 'invictus.ambire.com'
const EXTERNAL_SERVICE_HOSTS = ['api.pimlico.io']

function getBackgroundRequestsByType(requests) {
  const nativeTokenPriceRequests = []
  const batchedErc20TokenPriceRequests = []
  const hintsRequests = []
  const rpcRequests = []
  const externalServiceRequests = []
  const uncategorizedRequests = []

  requests.forEach((request) => {
    const url = new URL(request)

    if (url.hostname === RELAYER_HOST && request.includes('/multi-hints')) {
      hintsRequests.push(request)
      return
    }

    if (url.hostname === CENA_HOST) {
      if (request.includes('/simple/price')) {
        nativeTokenPriceRequests.push(request)
        return
      }
      if (request.includes('/simple/token_price')) {
        batchedErc20TokenPriceRequests.push(request)
        return
      }
    }

    if (url.hostname === INVICTUS_HOST) {
      rpcRequests.push(request)
      return
    }

    if (
      request === 'https://unichain.api.onfinality.io/public' ||
      request === 'https://mantle-rpc.publicnode.com/'
    ) {
      return
    }

    if (EXTERNAL_SERVICE_HOSTS.some((host) => url.hostname.includes(host))) {
      externalServiceRequests.push(request)
      return
    }
    uncategorizedRequests.push(request)
  })

  return {
    nativeTokenPriceRequests,
    batchedErc20TokenPriceRequests,
    hintsRequests,
    rpcRequests,
    uncategorizedRequests,
    externalServiceRequests
  }
}

async function monitorRequests(
  client,
  requestInducingFunction,
  { maxTimeBetweenRequests = 2000, throttleRequestsByMs = 0, blockRequests = [] } = {}
) {
  const httpRequests = []
  let lastRequestTime = null

  // Disable cache
  await client.send('Network.setCacheDisabled', { cacheDisabled: true })
  // Enable Fetch domain for request interception
  await client.send('Fetch.enable', {
    patterns: [{ urlPattern: '*', requestStage: 'Request' }]
  })

  const onRequestPaused = async ({ requestId, request }) => {
    httpRequests.push(request.url)
    // Synchronize updates to lastRequestTime to avoid race conditions
    lastRequestTime = Date.now()

    if (blockRequests.some((blockRequest) => request.url.includes(blockRequest))) {
      await client.send('Fetch.failRequest', { requestId, errorReason: 'Aborted' })
      return
    }

    if (throttleRequestsByMs) {
      await wait(throttleRequestsByMs)
    }

    await client.send('Fetch.continueRequest', { requestId })
  }

  // Start listening to the request events
  client.on('Fetch.requestPaused', onRequestPaused)

  try {
    // Trigger the function that induces requests
    await requestInducingFunction()

    // Poll until no more requests are detected within the specified time frame
    while (
      !lastRequestTime ||
      Date.now() - lastRequestTime < maxTimeBetweenRequests + throttleRequestsByMs
    ) {
      await wait(maxTimeBetweenRequests) // Polling interval
    }
  } finally {
    // Ensure cleanup happens in case of error
    client.off('Fetch.requestPaused', onRequestPaused)
  }

  return httpRequests
}

export { monitorRequests, getBackgroundRequestsByType }
