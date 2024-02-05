import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'

import { storage } from '../webapi/storage'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum ONBOARDING_VALUES {
  ON_BOARDED = 'on-boarded',
  NOT_ON_BOARDED = 'not-on-boarded'
}

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  #_isDefaultWallet: boolean = true

  get isDefaultWallet() {
    return this.#_isDefaultWallet
  }

  set isDefaultWallet(newValue: boolean) {
    this.#_isDefaultWallet = newValue
    storage.set('isDefaultWallet', newValue)
    this.emitUpdate()
  }

  #_onboardingStatus: ONBOARDING_VALUES = ONBOARDING_VALUES.NOT_ON_BOARDED

  get onboardingStatus() {
    return this.#_onboardingStatus
  }

  set onboardingStatus(newValue: ONBOARDING_VALUES) {
    this.#_onboardingStatus = newValue
    storage.set('onboardingStatus', newValue)
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

    this.#_onboardingStatus = await storage.get(
      'onboardingStatus',
      ONBOARDING_VALUES.NOT_ON_BOARDED
    )

    this.isReady = true
    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      isDefaultWallet: this.isDefaultWallet,
      onboardingStatus: this.onboardingStatus
    }
  }
}
