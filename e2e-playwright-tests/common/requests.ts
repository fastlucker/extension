import { Page } from '@playwright/test'

const RELAYER_HOST = 'relayer.ambire.com'
const CENA_HOST = 'cena.ambire.com'
const INVICTUS_HOST = 'invictus.ambire.com'
const EXTERNAL_SERVICE_HOSTS = ['api.pimlico.io']

function getBackgroundRequestsByType(requests: string[]) {
  const nativeTokenPriceRequests: string[] = []
  const batchedErc20TokenPriceRequests: string[] = []
  const hintsRequests: string[] = []
  const rpcRequests: string[] = []
  const externalServiceRequests: string[] = []
  const uncategorizedRequests: string[] = []

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

type MonitorRequestsOptions = {
  maxTimeBetweenRequests?: number
  throttleRequestsByMs?: number
  blockRequests?: string[]
}

export async function monitorRequests(
  page: Page,
  requestInducingFunction: () => Promise<void>,
  options: MonitorRequestsOptions = {}
): Promise<string[]> {
  const { maxTimeBetweenRequests = 2000, throttleRequestsByMs = 0, blockRequests = [] } = options

  const httpRequests: string[] = []
  let lastRequestTime: number | null = null

  const client = await page.context().newCDPSession(page)

  await client.send('Network.setCacheDisabled', { cacheDisabled: true })
  await client.send('Fetch.enable', {
    patterns: [{ urlPattern: '*', requestStage: 'Request' }]
  })

  const onRequestPaused = async ({ requestId, request }: any) => {
    httpRequests.push(request.url)
    lastRequestTime = Date.now()

    if (blockRequests.some((blockRequest) => request.url.includes(blockRequest))) {
      await client.send('Fetch.failRequest', { requestId, errorReason: 'Aborted' })
      return
    }

    if (throttleRequestsByMs) {
      await new Promise((res) => setTimeout(res, throttleRequestsByMs))
    }

    await client.send('Fetch.continueRequest', { requestId })
  }

  client.on('Fetch.requestPaused', onRequestPaused)

  try {
    await requestInducingFunction()

    while (
      !lastRequestTime ||
      Date.now() - lastRequestTime < maxTimeBetweenRequests + throttleRequestsByMs
    ) {
      await new Promise((res) => setTimeout(res, maxTimeBetweenRequests))
    }
  } finally {
    client.off('Fetch.requestPaused', onRequestPaused)
    await client.send('Fetch.disable')
  }

  return httpRequests
}

export { getBackgroundRequestsByType }
