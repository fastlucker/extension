import { browserAPI } from '@web/constants/browserAPI'

// TODO: Move these to a separate file
class WebExtensionStorage {
  isInitialized = false

  storage = []

  constructor() {
    this.init()
  }

  async init() {
    // TODO: Fallback to local storage (mobile & web with MMKV, extension with Chrome storage)
    const { local } = browserAPI.storage

    await local.get().then((result: any) => {
      const err = WebExtensionStorage.checkForError()
      if (!err) {
        this.storage = result || []
      }
    })

    this.isInitialized = true
  }

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

  getItem(key: string) {
    return this.storage[key]
  }

  setItem(key: string, value: string) {
    this.storage[key] = value

    const { local } = browserAPI.storage
    local.set({ ...this.storage, [key]: value }).then(() => {
      const err = WebExtensionStorage.checkForError()
      if (err) {
        // Handle errors.
      }
    })
  }

  removeItem(key: string) {
    delete this.storage[key]

    const { local } = browserAPI.storage
    local.remove([key]).then(() => {
      const err = WebExtensionStorage.checkForError()
      if (err) {
        // Handle errors.
      }
    })
  }
}

// TODO: Move this on a place where storage is initialized.
export const SyncStorage: {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
} = {
  getItem: (key: string) => storage.getItem(key),
  setItem: (key: string, value: string) => {
    storage.setItem(key, value)
  },
  removeItem: (key: string) => {
    storage.removeItem(key)
  }
}
