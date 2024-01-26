import EventEmitter from '@ambire-common/controllers/eventEmitter'

import { storage } from '../webapi/storage'

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
      this.isDefaultWallet = isDefault
    }

    this.isReady = true
    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      isDefaultWallet: this.isDefaultWallet // includes the getter in the stringified instance
    }
  }
}
