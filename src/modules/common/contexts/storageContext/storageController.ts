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

      this.onExtensionStorageChange && this.onExtensionStorageChange(changes)
    }
  }

  async init() {
    if (isExtension) {
      const result = await browserAPI.storage.local.get()

      this.extensionSyncStorage = { ...defaultExtensionSyncStorage, ...result }

      // Subscribe to changes in order to always keep in sync the
      // local `extensionSyncStorage` with the browserAPI.storage.local
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

  getItem(key: string) {
    if (isExtension) {
      return this.extensionSyncStorage[key]
    }

    return this.mmkv?.getString(key)
  }

  setItem(key: string, value: string) {
    if (isExtension) {
      this.extensionSyncStorage[key] = value

      browserAPI.storage.local.set({ ...this.extensionSyncStorage, [key]: value })
    } else {
      this.mmkv?.set(key, value)
    }
  }

  removeItem(key: string) {
    if (isExtension) {
      delete this.extensionSyncStorage[key]

      browserAPI.storage.local.remove([key])
    } else {
      this.mmkv?.delete(key)
    }
  }
}
