import EventEmitter, { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Banner } from '@ambire-common/interfaces/banner'
import { browser, isSafari } from '@web/constants/browserapi'
import { logInfoWithPrefix } from '@web/utils/logger'

/**
 * The `ExtensionUpdateController` manages the lifecycle and notifications
 * for browser extension updates. It listens for update events from the
 * browser runtime, tracks the update state, and provides mechanisms for
 * notifying users and applying updates.
 *
 * Responsibilities:
 * - Listens to the `onUpdateAvailable` event to detect when a new version
 *   of the extension is available.
 * - Tracks the update status and exposes it via a user-facing banner.
 * - Allows users to reload the extension to apply updates.
 */
export class ExtensionUpdateController extends EventEmitter {
  isReady: boolean = false

  #updateAvailableHandler: (details: { version: string }) => void

  #isUpdateAvailable: boolean = true

  constructor() {
    super()
    this.#updateAvailableHandler = this.#onUpdateAvailable.bind(this)
    this.#init()
  }

  #init() {
    this.#startListening()
    this.isReady = true
    this.emitUpdate()
  }

  #startListening(): void {
    // Safari does not support this event
    if (isSafari()) return

    try {
      logInfoWithPrefix('[Started listening for extension updateAvailable event]')
      browser.runtime.onUpdateAvailable.addListener(this.#updateAvailableHandler)
    } catch (e: any) {
      this.emitError({
        level: 'silent',
        message: 'Failed to add updateAvailable listener.',
        error: e
      })
    }
  }

  #onUpdateAvailable(details: { version: string }): void {
    logInfoWithPrefix('[Extension Update Available]', `Version: ${details.version}`)
    this.#isUpdateAvailable = true
    this.emitUpdate()
  }

  applyUpdate() {
    this.#isUpdateAvailable = false

    // Note: Calling browser.runtime.reload() is sufficient to apply the update when onUpdateAvailable is triggered.
    browser.runtime.reload()
    this.emitUpdate()
  }

  get extensionUpdateBanner(): Banner[] {
    if (this.#isUpdateAvailable) {
      return [
        {
          id: 'update-available',
          type: 'info',
          title: 'Update Available',
          text: 'A new version is ready! It will be applied automatically the next time your browser or extension reloads. Reload now to update immediately.',
          actions: [
            {
              label: 'Reload',
              actionName: 'update-extension-version'
            }
          ]
        }
      ]
    }
    return []
  }

  toJSON(): this & { emittedErrors: ErrorRef[] } {
    return {
      ...this,
      ...super.toJSON(),
      extensionUpdateBanner: this.extensionUpdateBanner
    }
  }
}

export default ExtensionUpdateController
