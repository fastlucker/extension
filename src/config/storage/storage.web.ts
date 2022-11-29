import { browserAPI } from '@web/constants/browserAPI'

// Storage
// which tabs are injected tabId => true
export let TAB_INJECTIONS = {}
// permissions host => true/false
export let PERMISSIONS = {}
// pending notifications asking for user attention (sign / send tx)
export let USER_ACTION_NOTIFICATIONS = {}

// TODO: Move these to a separate file
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

    TAB_INJECTIONS = { ...TAB_INJECTIONS, ...this.storage['TAB_INJECTIONS'] }
    PERMISSIONS = { ...PERMISSIONS, ...this.storage['PERMISSIONS'] }
    USER_ACTION_NOTIFICATIONS = {
      ...USER_ACTION_NOTIFICATIONS,
      ...this.storage['USER_ACTION_NOTIFICATIONS']
    }

    browserAPI.storage.local.set({ USER_ACTION_NOTIFICATIONS: {} })

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

  getItem({ key }: { key: string }) {
    console.log('incoming key', key)
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

export const hasMigratedFromAsyncStorage = true
export const migrateFromAsyncStorage = () => {}

// TODO: Move this on a place where storage is initialized.
let storage: StorageController
export const SyncStorage: {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  isStorageLoaded(): void
  init: () => void
} = {
  init: () => {
    if (!storage) {
      storage = new StorageController()
    }
  },
  isStorageLoaded: () => storage.isStorageLoaded(),
  getItem: (key: string) => storage.getItem(key),
  setItem: (key: string, value: string) => {
    storage.setItem(key, value)
  },
  removeItem: (key: string) => {
    storage.removeItem(key)
  }
}
