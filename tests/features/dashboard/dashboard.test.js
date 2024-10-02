import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'

import { checkBalanceInAccount, checkIfTokensExist, checkCollectibleItem } from './functions.js'

describe('dashboard', () => {
  let browser
  let page
  let recorder
  beforeEach(async () => {
    ;({ browser, page, recorder } = await bootstrapWithStorage('dashboard', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('should have balance on the dashboard', async () => {
    await checkBalanceInAccount(page)
  })

  it('should test if expected tokens are visible on the dashboard', async () => {
    await checkIfTokensExist(page)
  })

  it('should test if expected NFTs are visible on the dashboard', async () => {
    await checkCollectibleItem(page)
  })
})
