import { bootstrap } from '../../common-helpers/bootstrap'
import { constants } from '../../constants/constants'
import { test } from '../../fixtures/pageObjects' // your extended test with authPage

test.describe('auth', () => {
  let page
  let extensionURL
  let serviceWorker

  test.beforeEach(async () => {
    /* ToDo Migration: commented out for now
    ;({ browser, page, recorder, extensionURL, serviceWorker } = await bootstrap('auth'))
    */
    ;({ page, extensionURL, serviceWorker } = await bootstrap('auth'))
    await page.goto(`${extensionURL}${constants.urls.getStarted}`)
    // Bypass the invite verification step
    await serviceWorker.evaluate(
      (invite) => chrome.storage.local.set({ invite, isE2EStorageSet: true }),
      JSON.stringify(constants.inviteStorageItem)
    )

    await page.goto(`${extensionURL}${constants.urls.getStarted}`)
  })

  test('should import view-only Basic account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(page, constants.addresses.basicAccount)
  })

  test('should import view-only Smart account', async ({ authPage }) => {
    await authPage.importViewOnlyAccount(page, constants.addresses.smartAccount)
  })
})
