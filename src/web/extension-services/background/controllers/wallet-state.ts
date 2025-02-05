/* eslint-disable @typescript-eslint/no-floating-promises */
import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { browser, isSafari } from '@web/constants/browserapi'
import { storage } from '@web/extension-services/background/webapi/storage'

import { Settings } from '@ambire-common/interfaces/settings'
import {
  handleRegisterScripts,
  handleUnregisterAmbireInpageScript,
  handleUnregisterEthereumInpageScript
} from '../handlers/handleScripting'

export class WalletStateController extends EventEmitter implements Settings {
  isReady: boolean = false

  #_isDefaultWallet: boolean = true

  #_onboardingState?: { version: string; viewedAt: number } = undefined

  #isPinned: boolean = true

  #isPinnedInterval: ReturnType<typeof setTimeout> | undefined = undefined

  #isSetupComplete: boolean = true

  // when the user tries to sign a txn with an EOA, we ask him does he want
  // to transition to smart. If he doesn't and explicitly checks a checkbox,
  // we do not ask him again. This is the setting for that
  #disable7702Popup: { [accAddr: string]: boolean } = {}

  get isDefaultWallet() {
    return this.#_isDefaultWallet
  }

  async setDefaultWallet(newValue: boolean) {
    this.#_isDefaultWallet = newValue
    storage.set('isDefaultWallet', newValue)
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    const extensionUrl = chrome.runtime.getURL('')

    // If the url of the current tab is the url of the extension, skip the reload
    // Perhaps we should also skip the injection of the scripts
    const skipReload = tab?.url?.startsWith(extensionUrl)

    if (newValue) {
      // if Ambire is the default wallet inject and reload the current tab
      await handleUnregisterAmbireInpageScript()
      await handleUnregisterEthereumInpageScript()
      await handleRegisterScripts()
      if (!skipReload && tab?.id) await this.#reloadPageOnSwitchDefaultWallet(tab.id)
    } else {
      await handleUnregisterEthereumInpageScript()
      if (!skipReload && tab?.id) await this.#reloadPageOnSwitchDefaultWallet(tab.id)
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

  shouldDisable7702Popup(accAddr: string): boolean {
    return !!this.#disable7702Popup[accAddr]
  }

  setShouldDisable7702Popup(accAddr: string, shouldDisable: boolean): void {
    this.#disable7702Popup[accAddr] = shouldDisable

    storage.set('disable7702Popup', this.#disable7702Popup)
  }

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
    // @ts-ignore
    const [isDefault, disable7702Popup] = await Promise.all([
      storage.get('isDefaultWallet', undefined),
      storage.get('disable7702Popup', false)
    ])
    this.#disable7702Popup = disable7702Popup

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

    this.#isPinned = isSafari() || (await storage.get('isPinned', false))
    this.#initCheckIsPinned()

    this.#isSetupComplete = await storage.get('isSetupComplete', true)

    this.isReady = true
    this.emitUpdate()
  }

  async #reloadPageOnSwitchDefaultWallet(tabId: number) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          window.location.reload()
        }
      })
    } catch (error) {
      // Silent fail
    }
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
      isDefaultWallet: this.isDefaultWallet,
      onboardingState: this.onboardingState,
      isPinned: this.isPinned,
      isSetupComplete: this.isSetupComplete
    }
  }
}
