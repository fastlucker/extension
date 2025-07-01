import { bootstrapWithStorage } from 'common-helpers/bootstrap'
import { BasePage } from './basePage'
import selectors from '../constants/selectors'
import { KEYSTORE_PASS, baParams } from '../constants/env'

export class StabilityPage extends BasePage {
  serviceWorker: any

  extensionURL: string

  context: any

  async init(param) {
    const { page, serviceWorker, extensionURL, context } = await bootstrapWithStorage(
      'stability',
      param,
      true
    )

    this.page = page
    this.context = context
    this.serviceWorker = serviceWorker
    this.extensionURL = extensionURL

    await this.context.route('**/invictus.ambire.com/polygon', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'mocked' })
      })
    })

    const {
      parsedKeystoreUID: keyStoreUid,
      parsedKeystoreKeys: keystoreKeys,
      parsedKeystoreSecrets: keystoreSecrets
    } = baParams

    await this.serviceWorker.evaluate((params) => chrome.storage.local.set(params), {
      keyStoreUid,
      keystoreKeys,
      keystoreSecrets
    })

    await this.page.goto(`${extensionURL}/tab.html#/`, { waitUntil: 'load' })

    await this.page.getByTestId(selectors.passphraseField).fill(KEYSTORE_PASS)
    await this.page.getByTestId(selectors.buttonUnlock).click()
  }
}
