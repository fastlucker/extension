import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { CachedResolvedDomain } from '@ambire-common/interfaces/domains'

import { storage } from '../webapi/storage'

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  #_isDefaultWallet: boolean = true

  #_cachedResolvedDomains: CachedResolvedDomain[] = []

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

  get cachedResolvedDomains() {
    return this.#_cachedResolvedDomains
  }

  cacheResolvedDomain(newDomain: CachedResolvedDomain) {
    const isDomainAlreadyCached = this.#_cachedResolvedDomains.find(
      ({ name, address }) => newDomain.name === name && newDomain.address === address
    )
    if (isDomainAlreadyCached) return

    this.#_cachedResolvedDomains = [...this.#_cachedResolvedDomains, newDomain]
    storage.set('cachedResolvedDomains', this.cachedResolvedDomains)

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

    this.#_cachedResolvedDomains = await storage.get('cachedResolvedDomains', [])
    this.#_onboardingState = await storage.get('onboardingState', undefined)

    this.isReady = true
    this.emitUpdate()
  }

  toJSON() {
    return {
      ...this,
      cachedResolvedDomains: this.cachedResolvedDomains,
      isDefaultWallet: this.isDefaultWallet,
      onboardingState: this.onboardingState
    }
  }
}
