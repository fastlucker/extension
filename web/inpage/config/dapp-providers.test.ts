import { providers } from 'ethers'
import puppeteer from 'puppeteer'

import { DAPP_PROVIDER_URLS } from './dapp-providers'

describe('Credentials for dApps own Ethereum RPC providers', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  // eslint-disable-next-line no-restricted-syntax
  for (const [hostname, providerUrls] of Object.entries(DAPP_PROVIDER_URLS)) {
    describe(`for ${hostname}`, () => {
      beforeAll(async () => {
        await page.goto(`https://${hostname}/`)
      })

      for (const [networkId, providerUrl] of Object.entries(providerUrls)) {
        it(`should create a valid provider for ${networkId}`, async () => {
          const networkData = await page.evaluate((providerUrl: string) => {
            const provider = providerUrl.startsWith('wss:')
              ? new providers.WebSocketProvider(providerUrl)
              : new providers.JsonRpcProvider(providerUrl)

            return provider.getNetwork()
          }, providerUrl)

          expect(networkData).toMatchObject({
            chainId: expect.any(Number),
            name: expect.any(String)
          })
        })
      }
    })
  }
})
