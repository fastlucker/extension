import { bootstrapWithStorage, baParams } from '../functions.js'
import { checkBalanceInAccount, checkNetworks, checkCollectibleItem } from '../common/balance.js'

describe('ba_balance', () => {
  let browser, page, recorder
  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('ba_balance', baParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('check the balance in account ', async () => {
    await checkBalanceInAccount(page)
  })

  it('check if networks Ethereum, USDC and Polygon exist in the account  ', async () => {
    await checkNetworks(page)
  })

  it('check if item exist in Collectibles tab', async () => {
    await checkCollectibleItem(page)
  })
})
