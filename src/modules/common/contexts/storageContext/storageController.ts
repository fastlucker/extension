import { MMKV } from 'react-native-mmkv'

import { browserAPI, isExtension } from '@web/constants/browserAPI'

const defaultExtensionSyncStorage = {
  // which tabs are injected tabId => true
  TAB_INJECTIONS: {},
  // permissions host => true/false
  PERMISSIONS: {},
  // pending notifications asking for user attention (sign / send tx)
  USER_ACTION_NOTIFICATIONS: {}
}

export class StorageController {
  isInitialized = false

  extensionSyncStorage: { [key: string]: any } = { ...defaultExtensionSyncStorage }

  onExtensionStorageChange?: (changes: {
    [key: string]: { newValue: any; oldValue: any }
  }) => void = () => {}

  /**
   * Key-value storage framework, faster and synchronous alternative to
   * the local storage on the web and async storage on mobile.
   * Supports iOS, Android and web
   */
  mmkv: MMKV | null = null

  constructor({ onExtensionStorageChange = () => {} } = {}) {
    this.onExtensionStorageChange = onExtensionStorageChange
  }

  handleOnExtensionStorageChange = (
    changes: { [key: string]: { newValue: any; oldValue: any } },
    namespace: string
  ) => {
    if (namespace === 'local') {
      const allKeysChanged = Object.keys(changes)

      const nextStorage = { ...this.extensionSyncStorage }
      allKeysChanged.forEach((key: string) => {
        nextStorage[key] = changes[key].newValue
      })

      this.extensionSyncStorage = { ...nextStorage }

      this.onExtensionStorageChange(changes)
    }
  }

  async init() {
    if (isExtension) {
      // TODO: Fallback to local storage (mobile & web with MMKV, extension with Chrome storage)
      await browserAPI.storage.local.get().then((result: any) => {
        const err = StorageController.checkForError()
        if (!err) {
          this.extensionSyncStorage = { ...defaultExtensionSyncStorage, ...result }
        }
      })

      browserAPI.storage.onChanged.addListener(this.handleOnExtensionStorageChange)
    } else {
      this.mmkv = new MMKV()
    }

    this.isInitialized = true

    return () =>
      isExtension
        ? browserAPI.storage.onChanged.removeListener(this.handleOnExtensionStorageChange)
        : null
  }

  /**
   * Makes sure the storage is initialized before accessing it.
   * Needed for processing the background queue, because the background process
   * can go in inactive mode, and when inactive, the storage is not initially
   * available until it loads again.
   */
  async isStorageLoaded() {
    if (this.isInitialized) {
      return true
    }

    await this.init()
    return true
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
    if (isExtension) {
      return this.extensionSyncStorage[key]
    }

    return this.mmkv?.getString(key)
  }

  setItem(key: string, value: string) {
    if (isExtension) {
      this.extensionSyncStorage[key] = value

      browserAPI.storage.local.set({ ...this.extensionSyncStorage, [key]: value }).then(() => {
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
    if (isExtension) {
      delete this.extensionSyncStorage[key]

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
