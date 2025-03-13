/* eslint-disable @typescript-eslint/no-floating-promises */
import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { browser, isSafari } from '@web/constants/browserapi'
import { storage } from '@web/extension-services/background/webapi/storage'

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  #isPinned: boolean = true

  #isPinnedInterval: ReturnType<typeof setTimeout> | undefined = undefined

  #isSetupComplete: boolean = true

  get isPinned() {
    return this.#isPinned
  }

  set isPinned(newValue: boolean) {
    this.#isPinned = newValue
    storage.set('isPinned', newValue)
    this.emitUpdate()
  }

  get isSetupComplete() {
    return this.#isSetupComplete
  }

  set isSetupComplete(newValue: boolean) {
    this.#isSetupComplete = newValue
    if (!newValue) {
      this.#initCheckIsPinned()
    } else {
      clearTimeout(this.#isPinnedInterval)
    }
    storage.set('isSetupComplete', newValue)
    this.emitUpdate()
  }

  constructor() {
    super()

    this.#init()
  }

  async #init(): Promise<void> {
    // We no longer need to check for isDefaultWallet, but we need to remove it from storage if it is set in storage
    const isDefaultWalletStorageSet = await storage.get('isDefaultWallet', undefined)

    // If isDefaultWallet is set, remove the key from storage
    if (isDefaultWalletStorageSet !== undefined) {
      await storage.remove('isDefaultWallet')
    }

    // We no longer need to check for onboardingState, but we need to remove it from storage if it is set in storage
    const isOnboardingStateExists = await storage.get('onboardingState', undefined)

    // If onboardingState is set, remove the key from storage
    if (isOnboardingStateExists === undefined) {
      await storage.remove('onboardingState')
    }

    this.#isPinned = isSafari() || (await storage.get('isPinned', false))
    this.#initCheckIsPinned()

    this.#isSetupComplete = await storage.get('isSetupComplete', true)

    this.isReady = true
    this.emitUpdate()
  }

  async #initCheckIsPinned() {
    if (this.isPinned && this.#isPinnedInterval) clearTimeout(this.#isPinnedInterval)
    if (this.isPinned) return
    // @ts-ignore
    const userSettings = await browser.action.getUserSettings()
    if (userSettings.isOnToolbar) this.isPinned = true

    if (!this.#isSetupComplete) {
      this.#isPinnedInterval = setTimeout(this.#initCheckIsPinned.bind(this), 500)
    }
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
