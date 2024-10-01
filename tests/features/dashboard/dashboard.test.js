import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'

import { checkBalanceInAccount, checkNetworks, checkCollectibleItem } from './functions.js'

describe('sa_balance', () => {
  let browser
  let page
  let recorder
  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('dashboard', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    // await browser.close()
  })

  //   should have balance on the dashboard
  //   should test if expected tokens are visible on the dashboard
  //   should test if expected NFTs are visible on the dashboard

  it.skip('should have balance on the dashboard', async () => {
    await checkBalanceInAccount(page)
  })

  it.skip('check if networks Ethereum, USDC and Polygon exist in the account  ', async () => {
    await checkNetworks(page)
  })

  it('check if item exist in Collectibles tab', async () => {
    await checkCollectibleItem(page)
  })
})
