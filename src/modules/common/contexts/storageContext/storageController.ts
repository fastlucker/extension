import { MMKV } from 'react-native-mmkv'

import { browserAPI, isExtension } from '@web/constants/browserAPI'

const defaultState = {
  // which tabs are injected tabId => true
  TAB_INJECTIONS: {},
  // permissions host => true/false
  PERMISSIONS: {},
  // pending notifications asking for user attention (sign / send tx)
  USER_ACTION_NOTIFICATIONS: {}
}

export class StorageController {
  isInitialized = false

  storage: { [key: string]: any } = { ...defaultState }

  /**
   * Key-value storage framework, faster and synchronous alternative to
   * the local storage on the web and async storage on mobile.
   * Supports iOS, Android and web
   */
  mmkv: MMKV | null = null

  handleOnStorageChange = (
    changes: { [key: string]: { newValue: any; oldValue: any } },
    namespace: string
  ) => {
    if (namespace === 'local') {
      const allKeysChanged = Object.keys(changes)

      const nextStorage = { ...this.storage }
      allKeysChanged.forEach((key: string) => {
        nextStorage[key] = changes[key].newValue
      })

      this.storage = { ...nextStorage }
    }
  }

  constructor() {
    if (this.isInitialized) return

    this.init()
  }

  async init() {
    if (isExtension) {
      // TODO: Fallback to local storage (mobile & web with MMKV, extension with Chrome storage)
      await browserAPI.storage.local.get().then((result: any) => {
        const err = StorageController.checkForError()
        if (!err) {
          this.storage = { ...defaultState, ...result }
        }
      })

      browserAPI.storage.onChanged.addListener(this.handleOnStorageChange)
    } else {
      this.mmkv = new MMKV()
    }

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

  setItem(key: string, value: string) {
    this.storage[key] = value

    if (isExtension) {
      browserAPI.storage.local.set({ ...this.storage, [key]: value }).then(() => {
        const err = StorageController.checkForError()
        if (err) {
          // Handle errors.
        }
      })
    } else {
      this.mmkv?.set(key, value)
    }
  }

  removeItem(key: string) {
    delete this.storage[key]

    if (isExtension) {
      browserAPI.storage.local.remove([key]).then(() => {
        const err = StorageController.checkForError()
        if (err) {
          // Handle errors.
        }
      })
    } else {
      this.mmkv?.delete(key)
    }
  }
}
