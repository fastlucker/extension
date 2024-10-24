import { bootstrapWithStorage } from '../common-helpers/bootstrapWithStorage'
import { baParams } from '../config/constants'

import { addContactInAddressBook } from '../common/other.js'

describe('ba_other', () => {
  let browser
  let page
  let recorder
  let extensionURL

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage('ba_other', baParams))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })

  it('add contact in address book', async () => {
    await addContactInAddressBook(page, extensionURL)
  })
})
