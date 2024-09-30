// - should set up keystore
// - should unlock keystore

import { bootstrapWithStorage } from '../../common-helpers/bootstrapWithStorage'
import { saParams } from '../../config/constants'

import { lockKeystore, changeKeystorePassword } from './functions'

describe('auth', () => {
  let browser
  let page
  let extensionURL
  let recorder

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage('keystore', saParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('should lock keystore', async () => {
    await lockKeystore(page, extensionURL)
  })

  it('should change keystore password', async () => {
    await changeKeystorePassword(page, extensionURL)
  })
})
