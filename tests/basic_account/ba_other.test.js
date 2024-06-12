import { bootstrapWithStorage, baParams, clickOnElement, typeText } from '../functions.js'

describe('ba_other', () => {
  let browser
  let page
  let recorder
  let extensionRootUrl

  beforeEach(async () => {
    const context = await bootstrapWithStorage('ba_other', baParams)

    browser = context.browser
    page = context.page
    recorder = context.recorder
    extensionRootUrl = context.extensionRootUrl
  })

  afterEach(async () => {
    await recorder.stop()
    await browser.close()
  })
  //--------------------------------------------------------------------------------------------------------------
  it('change password', async () => {
    await page.goto(`${extensionRootUrl}/tab.html#/settings/device-password-change`, {
      waitUntil: 'load'
    })
    const oldPass = process.env.KEYSTORE_PASS
    const newPass = 'B1234566'
    await typeText(page, '[data-testid="enter-current-pass-field"]', oldPass)
    await typeText(page, '[data-testid="enter-new-pass-field"]', newPass)
    await typeText(page, '[data-testid="repeat-new-pass-field"]', newPass)

    await clickOnElement(page, '[data-testid="change-device-pass-button"]')

    // Wait for the modal to appear
    await page.waitForSelector('[data-testid="device-pass-success-modal"]')

    // Click on the element within the modal
    await clickOnElement(page, '[data-testid="device-pass-success-modal"]')

    await typeText(page, '[data-testid="enter-current-pass-field"]', newPass)
    await typeText(page, '[data-testid="enter-new-pass-field"]', oldPass)
    await typeText(page, '[data-testid="repeat-new-pass-field"]', oldPass)

    await clickOnElement(page, '[data-testid="change-device-pass-button"]')

    // Wait for the modal to appear
    await page.waitForSelector('[data-testid="device-pass-success-modal"]')

    // Click on the element within the modal
    await clickOnElement(page, '[data-testid="device-pass-success-modal"]')

    await new Promise((r) => setTimeout(r, 1000))

    const isModalExist = await page.evaluate(() => {
      // Check if the element "device-pass-success-modal" exists
      return !!document.querySelector('[data-testid="device-pass-success-modal"]')
    })

    expect(isModalExist).toBe(false)
  })

  //--------------------------------------------------------------------------------------------------------------
  it('Add contact in address book', async () => {
    await page.goto(`${extensionRootUrl}/tab.html#/settings/address-book`, {
      waitUntil: 'load'
    })

    const addName = 'First Address'
    const addAddress = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'
    // 0xC254b41be9582...          dD3F8092D4ea6C

    await typeText(page, '[data-testid="contact-name-field"]', addName)
    await typeText(page, '[data-testid="address-ens-field"]', addAddress)

    await clickOnElement(page, '[data-testid="add-to-address-book-button"]')

    await page.waitForSelector('[data-testid="name-first-address"]')

    const addressContent = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="name-first-address"]') // Replace with your actual selector
      return element.outerHTML
    })

    // Ensure the element contains both the name and address
    expect(addressContent).toContain(addName)
    expect(addressContent).toContain(addAddress.substring(addAddress.length - 14))
  })
})
