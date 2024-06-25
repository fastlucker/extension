import { typeText, clickOnElement } from '../functions'

//--------------------------------------------------------------------------------------------------------------
export async function changePassword(page, extensionRootUrl) {
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
  //! !!FOR THE MOMENT "SIGN OUT" BUTTON DOESN'T EXIST IN THE FULL SCREEN MODE. BELLOW WE VERIFY THAT CHANGED PASSWORD IS ALREADY IN USE.
  // THIS STEP WILL BE CHANGED WHEN THE BUTTON IS CREATED!!!
  await typeText(page, '[data-testid="enter-current-pass-field"]', newPass)
  await typeText(page, '[data-testid="enter-new-pass-field"]', oldPass)
  await typeText(page, '[data-testid="repeat-new-pass-field"]', oldPass)

  await clickOnElement(page, '[data-testid="change-device-pass-button"]')

  // Wait for the modal to appear
  await page.waitForSelector('[data-testid="device-pass-success-modal"]')

  // Click on the element within the modal
  clickOnElement(page, '[data-testid="device-pass-success-modal"]')
  // Wait for the modal to be closed
  await page.waitForSelector('[data-testid="device-pass-success-modal"]', {
    hidden: true
  })
}

//--------------------------------------------------------------------------------------------------------------
export async function addContactInAddressBook(page, extensionRootUrl) {
  await page.goto(`${extensionRootUrl}/tab.html#/settings/address-book`, {
    waitUntil: 'load'
  })

  const addName = 'First Address'
  const addAddress = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'
  // 0xC254b41be9582...          dD3F8092D4ea6C

  await typeText(page, '[data-testid="contact-name-field"]', addName)
  await typeText(page, '[data-testid="address-ens-field"]', addAddress)

  await page.waitForSelector('[data-testid="add-to-address-book-button"]')
  await clickOnElement(page, '[data-testid="add-to-address-book-button"]')

  await page.waitForSelector('[data-testid="name-first-address"]')

  const addressContent = await page.evaluate(() => {
    const element = document.querySelector('[data-testid="name-first-address"]')
    return element.outerHTML
  })

  // Ensure the element contains both the name and address
  expect(addressContent).toContain(addName)
  expect(addressContent).toContain(addAddress.substring(addAddress.length - 14))
}
