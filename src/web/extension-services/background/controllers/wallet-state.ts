/* eslint-disable @typescript-eslint/no-floating-promises */
import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { storage } from '@web/extension-services/background/webapi/storage'

import {
  handleRegisterScripts,
  handleUnregisterAmbireInpageScript,
  handleUnregisterEthereumInpageScript
} from '../handlers/handleScripting'

export class WalletStateController extends EventEmitter {
  isReady: boolean = false

  #_isDefaultWallet: boolean = true

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
      // if Ambire is the default wallet inject and reload the current tab
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      ;(async () => {
        await handleUnregisterAmbireInpageScript()
        await handleUnregisterEthereumInpageScript()
        await handleRegisterScripts(true)
        await this.#reloadPageOnSwitchDefaultWallet()
      })()
    } else {
      ;(async () => {
        // if Ambire is NOT the default wallet remove injection and reload the current tab
        await handleUnregisterEthereumInpageScript()
        await this.#reloadPageOnSwitchDefaultWallet()
      })()
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

      if (!isDefault) {
        // injecting is registered first thing in the background
        // but if Ambire is not the default wallet the injection should be removed
        handleUnregisterEthereumInpageScript()
      }
    }

    this.#_onboardingState = await storage.get('onboardingState', undefined)

    this.isReady = true
    this.emitUpdate()
  }

  async #reloadPageOnSwitchDefaultWallet() {
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
