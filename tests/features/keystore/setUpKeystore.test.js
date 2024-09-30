import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'

import { setUpKeystore } from './functions'

describe('auth', () => {
  let browser
  let page
  let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage(
      'keystore',
      saParams,
      true
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('should set up keystore', async () => {
    await setUpKeystore(page, extensionURL)
  })
})
