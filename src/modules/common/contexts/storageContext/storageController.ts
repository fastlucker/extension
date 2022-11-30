import { browserAPI } from '@web/constants/browserAPI'
import { CONTENT_SCRIPT } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

const defaultState = {
  // which tabs are injected tabId => true
  TAB_INJECTIONS: {}
}

export class StorageController {
  isInitialized = false

  storage: { [key: string]: any } = { ...defaultState }

  constructor() {
    this.init()
  }

  async init() {
    // TODO: Fallback to local storage (mobile & web with MMKV, extension with Chrome storage)
    await browserAPI.storage.local.get().then((result: any) => {
      const err = StorageController.checkForError()
      if (!err) {
        this.storage = result || { ...defaultState }
      }
    })

    this.isInitialized = true
  }

  /**
   * Makes sure the storage is initialized before accessing it.
   * Needed for processing the background queue, because the background process
   * can go in inactive mode, and when inactive, the storage is not initially
   * available until it loads again.
   */
  async isStorageLoaded() {
    if (this.isInitialized) {
      return this.storage
    }

    await this.init()

    return this.storage
  }

  static checkForError() {
    const { lastError } = browserAPI.runtime
    if (!lastError) {
      return undefined
    }
    // if it quacks like an Error, its an Error
    if (lastError.stack && lastError.message) {
      return lastError
    }
    // repair incomplete error object (eg chromium v77)
    return new Error(lastError.message)
  }

  getStorage() {
    return this.storage
  }

  getItem(key: string) {
    return this.storage[key]
  }

  getItems(keys: string[]) {
    const result: { [key: string]: any } = {}
    keys.forEach((key: string) => {
      result[key] = this.storage[key]
    })

    return result
  }

  setItem(key: string, value: string) {
    this.storage[key] = value

    const { local } = browserAPI.storage
    local.set({ ...this.storage, [key]: value }).then(() => {
      const err = StorageController.checkForError()
      if (err) {
        // Handle errors.
      }
    })

    sendMessage(
      {
        type: 'storageController',
        to: CONTENT_SCRIPT,
        data: {
          method: 'setItem',
          props: { key, value }
        }
      },
      {
        ignoreReply: true
      }
    )

    // sendReply(message, {
    //   data: { storage: this.storage }
    // })
  }

  removeItem(key: string) {
    delete this.storage[key]

    const { local } = browserAPI.storage
    local.remove([key]).then(() => {
      const err = StorageController.checkForError()
      if (err) {
        // Handle errors.
      }
    })
  }
}
