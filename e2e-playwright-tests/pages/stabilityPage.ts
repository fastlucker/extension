import BootstrapContext from 'interfaces/bootstrapContext'

import { baParams, KEYSTORE_PASS } from '../constants/env'
import selectors from '../constants/selectors'
import Token from '../interfaces/token'
import { BasePage } from './basePage'

export class StabilityPage extends BasePage {
  serviceWorker: any

  extensionURL: string

  constructor(opts: BootstrapContext) {
    super(opts)
    this.serviceWorker = opts.serviceWorker
    this.extensionURL = opts.extensionURL ?? ''
  }

  async unlock() {
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

    await this.page.goto(`${this.extensionURL}/tab.html#/`, { waitUntil: 'load' })

    await this.page.getByTestId(selectors.passphraseField).fill(KEYSTORE_PASS)
    await this.page.getByTestId(selectors.buttonUnlock).click()
  }

  async blockRouteAndUnlock(blockedRoute: string) {
    await this.context.route(blockedRoute, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'mocked' })
      })
    })

    await this.unlock()
  }

  getDashboardTokenSelector(token: Token) {
    return this.page.getByTestId(`token-balance-${token.address}.${token.chainId}`)
  }
}
