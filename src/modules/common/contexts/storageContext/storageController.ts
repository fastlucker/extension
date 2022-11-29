import { browserAPI } from '@web/constants/browserAPI'
import { CONTENT_SCRIPT } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

export class StorageController {
  isInitialized = false

  storage = []

  constructor() {
    this.init()
  }

  async init() {
    // TODO: Fallback to local storage (mobile & web with MMKV, extension with Chrome storage)
    const { local } = browserAPI.storage

    await local.get().then((result: any) => {
      const err = StorageController.checkForError()
      if (!err) {
        this.storage = result || []
      }
    })

    this.isInitialized = true
  }

  // Used everywhere when we need to access a consistent state of the background
  // worker. Makes sure the storage is initialized before accessing it.
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

  getItem({ key }: { key: string }) {
    return this.storage[key]
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
