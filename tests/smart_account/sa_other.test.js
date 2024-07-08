import { bootstrapWithStorage, saParams } from '../functions.js'
import { changePassword, addContactInAddressBook } from '../common/other.js'

describe('sa_other', () => {
  let browser
  let page
  let recorder
  let extensionRootUrl

  beforeEach(async () => {
    ;({ browser, page, recorder, extensionRootUrl } = await bootstrapWithStorage(
      'sa_other',
      saParams
    ))
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })
  it.only('change password', async () => {
    await changePassword(page, extensionRootUrl)
  })

  it('add contact in address book', async () => {
    await addContactInAddressBook(page, extensionRootUrl)
  })
})
