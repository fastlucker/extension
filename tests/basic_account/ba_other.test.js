import { bootstrapWithStorage, baParams } from '../functions.js'
import { changePassword, addContactInAddressBook } from '../common/other.js'

describe('ba_other', () => {
  let browser, page, recorder, extensionURL

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionURL } = await bootstrapWithStorage(
      'ba_other',
      baParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })
  it('change password', async () => {
    await changePassword(page, extensionURL)
  })

  it('add contact in address book', async () => {
    await addContactInAddressBook(page, extensionURL)
  })
})
