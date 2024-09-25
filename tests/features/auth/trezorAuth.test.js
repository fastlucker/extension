import { bootstrap } from '../../common-helpers/bootstrap'
import {
  URL_GET_STARTED,
  URL_ACCOUNT_SELECT,
  INVITE_STORAGE_ITEM,
  INVITE_STATUS_VERIFIED,
  TEST_ACCOUNT_NAMES
} from './constants'
import { getController, setup, initTrezorConnect } from './trezorEmulator.setup'
import { SELECTORS } from '../../common/selectors/selectors'
import { completeOnboardingSteps } from '../../common-helpers/completeOnboardingSteps'
import { clickOnElement } from '../../common-helpers/clickOnElement'
import {
  wait,
  finishStoriesAndSelectAccount,
  personalizeAccountName,
  interactWithTrezorConnectPage,
  checkAccountDetails
} from './functions'

const TREZOR_EMULATOR_OPTIONS = {
  version: '1-main',
  model: 'T1B1',
  mnemonic: 'mnemonic_12',
  pin: '1234',
  passphrase_protection: false,
  label: 'Test Trezor Device',
  settings: {
    use_passphrase: false,
    experimental_features: true
  }
}

const controller = getController()

describe('Trezor Hardware Wallet Authentication E2E', () => {
  let browser
  let page
  let extensionURL
  let recorder
  let serviceWorker

  beforeAll(async () => {
    await setup(controller, TREZOR_EMULATOR_OPTIONS)
    await initTrezorConnect(controller)
  })

  afterAll(async () => {
    // Cleanup emulator and dispose of resources
    try {
      await controller.api.wipeEmu()
      await controller.api.stopBridge()
      await controller.api.stopEmu()
      await controller.dispose()
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  })

  beforeEach(async () => {
    const bootstrapResult = await bootstrap('auth')
    browser = bootstrapResult.browser
    page = bootstrapResult.page
    recorder = bootstrapResult.recorder
    extensionURL = bootstrapResult.extensionURL
    serviceWorker = bootstrapResult.serviceWorker

    // Bypass the invite verification step
    await serviceWorker.evaluate(
      (invite) => chrome.storage.local.set({ invite, isE2EStorageSet: true }),
      JSON.stringify(INVITE_STORAGE_ITEM)
    )

    await page.goto(`${extensionURL}${URL_GET_STARTED}`)
  })

  afterEach(async () => {
    if (recorder) await recorder.stop()
    if (browser) await browser.close()
  })

  it('should successfully authenticate using Trezor', async () => {
    // Get invite data from storage
    const inviteFromStorage = await serviceWorker.evaluate(() => chrome.storage.local.get('invite'))
    expect(Object.keys(inviteFromStorage).length).toBe(1)

    // Validate invitation status
    const parsedInvitation = JSON.parse(inviteFromStorage.invite)
    expect(parsedInvitation.status).toBe(INVITE_STATUS_VERIFIED)

    // Complete onboarding steps
    await completeOnboardingSteps(page)

    // Click to connect Trezor hardware wallet
    await clickOnElement(page, SELECTORS.getStartedButtonConnectHwWallet)
    await clickOnElement(page, SELECTORS.selectHwOptionTrezor)

    // Wait for Trezor connect page to open
    const newTarget = await browser.waitForTarget(
      (target) => target.url().startsWith('https://connect.trezor.io/'),
      { timeout: 5000 }
    )

    const trezorConnectPage = await newTarget.page()
    await trezorConnectPage.bringToFront()

    // Handle interaction with Trezor connect page
    await interactWithTrezorConnectPage(trezorConnectPage)

    // Complete the account selection and interaction process
    const { firstSelectedBasicAccount, firstSelectedSmartAccount } =
      await finishStoriesAndSelectAccount(page, true)

    const [accountName1, accountName2] = TEST_ACCOUNT_NAMES
    await personalizeAccountName(page, accountName1, 0)
    await personalizeAccountName(page, accountName2, 1)

    await wait(1000)

    // Click on "Save and Continue" button
    await clickOnElement(page, `${SELECTORS.saveAndContinueBtn}:not([disabled])`)

    await page.goto(`${extensionURL}${URL_ACCOUNT_SELECT}`, { waitUntil: 'load' })

    await checkAccountDetails(
      page,
      SELECTORS.account,
      [accountName1, accountName2],
      [firstSelectedBasicAccount, firstSelectedSmartAccount]
    )
  })
})
