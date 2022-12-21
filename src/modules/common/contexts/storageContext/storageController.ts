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

  /**
   * WARNING: Use await setItemAsync (async method) in the service_worker instead of setItem (sync method)
   * There are two instances of the storageController in the extension (one in the service_worker and the other in the UI)
   * The storage state of the two instances is sometimes out of sync because of storage listener working asynchronously
   * and awaiting the storage changes in one of the storage instances fixes the issue
   * We choose the the async usage of the storage to be in the service_worker because in the UI the storage usage should
   * be synchronous due to code reusability with the web wallet code
   */
  setItem(key: string, value: string) {
    if (isExtension) {
      this.extensionSyncStorage[key] = value

      browserAPI.storage.local.set({ ...this.extensionSyncStorage, [key]: value })
    } else {
      this.mmkv?.set(key, value)
    }
  }

  setItemAsync(key: string, value: string) {
    if (isExtension) {
      const { local } = browserAPI.storage

      return new Promise((resolve) => {
        this.extensionSyncStorage[key] = value

        local.set({ ...this.extensionSyncStorage, [key]: value }).then(() => {
          resolve(true)
        })
      })
    }
    this.mmkv?.set(key, value)
    return Promise.resolve(true)
  }

  /**
   * WARNING: Use await removeItemAsync (async method) in the service_worker instead of removeItem (sync method)
   * There are two instances of the storageController in the extension (one in the service_worker and the other in the UI)
   * The storage state of the two instances is sometimes out of sync because of storage listener working asynchronously
   * and awaiting the storage changes in one of the storage instances fixes the issue
   * We choose the the async usage of the storage to be in the service_worker because in the UI the storage usage should
   * be synchronous due to code reusability with the web wallet code
   */
  removeItem(key: string) {
    if (isExtension) {
      delete this.extensionSyncStorage[key]

      browserAPI.storage.local.remove([key])
    } else {
      this.mmkv?.delete(key)
    }
  }

  removeItemAsync(key: string) {
    if (isExtension) {
      const { local } = browserAPI.storage

      return new Promise((resolve) => {
        delete this.extensionSyncStorage[key]

        browserAPI.storage.local.remove([key])

        local.remove([key]).then(() => {
          resolve(true)
        })
      })
    }
    this.mmkv?.delete(key)
    return Promise.resolve(true)
  }
}
