import { clickOnElement } from '../../common-helpers/clickOnElement'
import { typeText } from '../../common-helpers/typeText'
import { SELECTORS } from '../../common/selectors/selectors'
import {
  URL_SETTINGS_GENERAL,
  URL_DEVICE_PASSWORD_CHANGE,
  NEW_KEYSTORE_PASSWORD
} from './constants'
import { DEF_KEYSTORE_PASS } from '../../config/constants'

// TODO: move to common functions
async function expectButtonIsVisible(page, selector) {
  const isVisible = await page.$eval(selector, (button) => {
    const buttonStyle = window.getComputedStyle(button)
    return (
      buttonStyle &&
      buttonStyle.display !== 'none' &&
      buttonStyle.visibility !== 'hidden' &&
      buttonStyle.opacity !== '0'
    )
  })

  expect(isVisible).toBe(true)
}

async function typeCurrentThenNewPassword(page, currPass, newPass) {
  await page.waitForSelector(SELECTORS.enterCurrentPassField)
  await typeText(page, SELECTORS.enterCurrentPassField, currPass)
  await typeText(page, SELECTORS.enterNewPassField, newPass)
  await typeText(page, SELECTORS.repeatNewPassField, newPass)
  await clickOnElement(page, SELECTORS.changeDevicePassButton)
  // Wait until the "Success device password" modal to be visible
  await page.waitForSelector(SELECTORS.bottomSheet)
  // Expect device the "Got it" button in the "Success device password" modal to be visible
  await expectButtonIsVisible(page, SELECTORS.devicePassSuccessModal)
  // Click on "Got it" button
  await clickOnElement(page, SELECTORS.devicePassSuccessModal)
  // Wait until the "Success device password" modal to be hidden
  await page.waitForSelector(SELECTORS.bottomSheet, { hidden: true })
}

export async function changeKeystorePassword(page, extensionURL) {
  await page.goto(`${extensionURL}${URL_DEVICE_PASSWORD_CHANGE}`, {
    waitUntil: 'load'
  })

  // Change the keystore password
  await typeCurrentThenNewPassword(page, DEF_KEYSTORE_PASS, NEW_KEYSTORE_PASSWORD)

  //! !!FOR THE MOMENT "SIGN OUT" BUTTON DOESN'T EXIST IN THE FULL SCREEN MODE. BELLOW WE VERIFY THAT CHANGED PASSWORD IS ALREADY IN USE.
  // THIS STEP WILL BE CHANGED WHEN THE BUTTON IS CREATED!!!

  // Restore the old password
  await typeCurrentThenNewPassword(page, NEW_KEYSTORE_PASSWORD, DEF_KEYSTORE_PASS)
}

export async function lockKeystore(page, extensionURL) {
  // TODO: constant for the url
  await page.goto(`${extensionURL}${URL_SETTINGS_GENERAL}`, {
    waitUntil: 'load'
  })

  await expectButtonIsVisible(page, SELECTORS.lockExtensionButton)
  await clickOnElement(page, SELECTORS.lockExtensionButton)

  const currentURL = page.url()
  expect(currentURL).toContain(URL_SETTINGS_GENERAL)
}
