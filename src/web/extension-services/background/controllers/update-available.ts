import EventEmitter, { ErrorRef } from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { Banner } from '@ambire-common/interfaces/banner'
import { browser } from '@web/constants/browserapi'

export class UpdateAvailableController extends EventEmitter {
  isReady: boolean = false
  #updateAvailableHandler: (details: { version: string }) => void
  #isUpdateAvailable: boolean = false

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
    console.log('Started listening for updateAvailable event.')
    browser.runtime.onUpdateAvailable.addListener(this.#updateAvailableHandler)
  }

  // TODO: check does it need to remove the listener?
  #stopListening(): void {
    browser.runtime.onUpdateAvailable.removeListener(this.#updateAvailableHandler)
  }

  #onUpdateAvailable(details: { version: string }): void {
    console.log(`Update available: Version ${details.version}`)
    this.#isUpdateAvailable = true
    this.emitUpdate()
  }

  reloadExtension() {
    this.#isUpdateAvailable = false
    browser.runtime.reload()
    this.emitUpdate()
  }

  get updateAvailableBanner(): Banner[] {
    if (this.#isUpdateAvailable) {
      return [
        {
          id: 'update-available',
          type: 'info',
          title: 'Update Available',
          text: 'A new version of the extension is ready. Reload now to update.',
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
      updateAvailableBanner: this.updateAvailableBanner
    }
  }
}

export default UpdateAvailableController
