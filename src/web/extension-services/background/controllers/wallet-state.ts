import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { storage } from '@web/extension-services/background/webapi/storage'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum AUTO_LOCK_PERIODS {
  never = 0, // never
  _7days = 604800000, // 7 days
  _1day = 86400000, // 1 day
  _4hours = 14400000, // 4 hours
  _1hour = 3600000, // 1 hour
  _10minutes = 600000 // 10 minutes
}

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  #_isDefaultWallet: boolean = true

  #_autoLockPeriod: AUTO_LOCK_PERIODS = 0 // number in ms

  #_onboardingState?: {
    version: string
    viewedAt: number
  } = undefined

  get isDefaultWallet() {
    return this.#_isDefaultWallet
  }

  set isDefaultWallet(newValue: boolean) {
    this.#_isDefaultWallet = newValue
    storage.set('isDefaultWallet', newValue)
    this.emitUpdate()
  }

  get autoLockPeriod() {
    return this.#_autoLockPeriod
  }

  set autoLockPeriod(newValue: AUTO_LOCK_PERIODS) {
    this.#_autoLockPeriod = newValue
    storage.set('autoLockPeriod', newValue)
    this.emitUpdate()
  }

  get onboardingState() {
    return this.#_onboardingState
  }

  set onboardingState(newValue: { version: string; viewedAt: number } | undefined) {
    this.#_onboardingState = newValue
    storage.set('onboardingState', newValue)
    this.emitUpdate()
  }

  constructor() {
    super()
    this.#init()
  }

  async #init(): Promise<void> {
    // @ts-ignore
    const isDefault = await storage.get('isDefaultWallet')
    // Initialize isDefaultWallet in storage if needed
    if (isDefault === undefined) {
      await storage.set('isDefaultWallet', true)
    } else {
      this.#_isDefaultWallet = isDefault
    }

    this.#_autoLockPeriod = await storage.get('autoLockPeriod', 0)
    this.#_onboardingState = await storage.get('onboardingState', undefined)

    this.isReady = true
    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      isDefaultWallet: this.isDefaultWallet,
      autoLockPeriod: this.autoLockPeriod,
      onboardingState: this.onboardingState
    }
  }
}
