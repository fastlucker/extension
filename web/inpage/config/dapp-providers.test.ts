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
            const testRpcCall = JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1
            })

            if (providerUrl.startsWith('wss:')) {
              return new Promise((resolve) => {
                const socket = new WebSocket(providerUrl)

                socket.onmessage = ({ data }) => resolve(JSON.parse(data))
                socket.onopen = () => socket.send(testRpcCall)
              })
            }

            return fetch(providerUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: testRpcCall
            }).then((res) => res.json())
          }, providerUrl)

          expect(networkData).toMatchObject({
            id: expect.any(Number),
            jsonrpc: expect.any(String),
            result: expect.any(String)
          })
        })
      }
    })
  }
})
