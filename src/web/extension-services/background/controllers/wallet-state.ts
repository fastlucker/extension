import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { isManifestV3 } from '@web/constants/browserapi'
import { storage } from '@web/extension-services/background/webapi/storage'

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  #_isDefaultWallet: boolean = true

  #registerInPageContentScript

  #unregisterInPageContentScript

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

    if (newValue) {
      this.#registerInPageContentScript()
      this.#reloadPageOnFocus()
    } else {
      this.#unregisterInPageContentScript()
      this.#reloadPageOnFocus()
    }
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

  constructor(registerInPageContentScript: Function, unregisterInPageContentScript: Function) {
    super()

    this.#registerInPageContentScript = registerInPageContentScript
    this.#unregisterInPageContentScript = unregisterInPageContentScript
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

      if (!isDefault) {
        this.#unregisterInPageContentScript()
      }
    }

    this.#_onboardingState = await storage.get('onboardingState', undefined)

    this.isReady = true
    this.emitUpdate()
  }

  async #reloadPageOnFocus() {
    if (!isManifestV3) return
    try {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
      if (!tab || !tab?.id) return
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          window.location.reload()
        }
      })
    } catch (error) {
      // Silent fail
    }
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      isDefaultWallet: this.isDefaultWallet,
      onboardingState: this.onboardingState
    }
  }
}
