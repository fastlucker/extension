import { MMKV } from 'react-native-mmkv'

import { browserAPI, isExtension } from '@web/constants/browserapi'
import { getDataFromStorage } from '@web/extension-services/background/webapi/storage'

export class StorageController {
  isInitialized = false

  extensionSyncStorage: { [key: string]: any } = {}

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
      const result = await getDataFromStorage()

      this.extensionSyncStorage = { ...result }

      // Subscribe to changes in order to always keep in sync the
      // local `extensionSyncStorage` with the browserAPI.storage.local
      browserAPI.storage.onChanged.addListener(this.handleOnExtensionStorageChange as any)
    } else {
      this.mmkv = new MMKV()
    }

    this.isInitialized = true

    return () =>
      isExtension
        ? browserAPI.storage.onChanged.removeListener(this.handleOnExtensionStorageChange as any)
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

      browserAPI.storage.local.set({ [key]: value })
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
