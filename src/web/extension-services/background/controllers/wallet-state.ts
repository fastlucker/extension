/* eslint-disable @typescript-eslint/no-floating-promises */
import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import CONFIG, { APP_VERSION } from '@common/config/env'
import { DEFAULT_THEME, ThemeType } from '@common/styles/themeConfig'
import * as Sentry from '@sentry/browser'
import { browser, isSafari } from '@web/constants/browserapi'
import { storage } from '@web/extension-services/background/webapi/storage'

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  isPinned: boolean = false

  #isPinnedTimeout: ReturnType<typeof setTimeout> | undefined = undefined

  #isSetupComplete: boolean = false

  themeType: ThemeType = DEFAULT_THEME

  get isSetupComplete() {
    return this.#isSetupComplete
  }

  set isSetupComplete(newValue: boolean) {
    this.#isSetupComplete = newValue
    storage.set('isSetupComplete', newValue)
    this.emitUpdate()
  }

  constructor() {
    super()

    this.#init()
  }

  async #init(): Promise<void> {
    this.#isSetupComplete = await storage.get('isSetupComplete', false)
    this.themeType = await storage.get('themeType', DEFAULT_THEME)
    this.isPinned = await this.#checkIsPinned()
    if (!this.isPinned) this.#initContinuousCheckIsPinned()

    // TODO: Move to a separate lib, figure out the best place.
    if (CONFIG.SENTRY_DSN_BROWSER_EXTENSION) {
      // TODO: Init only if permission is granted
      Sentry.init({
        dsn: CONFIG.SENTRY_DSN_BROWSER_EXTENSION,
        environment: CONFIG.APP_ENV,
        release: `extension-${process.env.WEB_ENGINE}@${APP_VERSION}`,
        // Disables sending personally identifiable information
        sendDefaultPii: false,
        integrations: []
      })
    }

    this.isReady = true
    this.emitUpdate()
  }

  async #checkIsPinned() {
    if (isSafari()) return false

    try {
      const userSettings = await browser.action.getUserSettings()
      return (userSettings.isOnToolbar as boolean) || false
    } catch (error) {
      return false
    }
  }

  async #initContinuousCheckIsPinned() {
    const isPinned = await this.#checkIsPinned()

    if (isPinned) {
      this.isPinned = true
      !!this.#isPinnedTimeout && clearTimeout(this.#isPinnedTimeout)
      this.emitUpdate()

      return
    }

    this.#isPinnedTimeout = setTimeout(this.#initContinuousCheckIsPinned.bind(this), 1000)
  }

  async setThemeType(type: ThemeType) {
    this.themeType = type
    await storage.set('themeType', type)

    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      isPinned: this.isPinned,
      isSetupComplete: this.isSetupComplete
    }
  }
}
