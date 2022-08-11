import { MMKV } from 'react-native-mmkv'

import AsyncStorage from '@react-native-async-storage/async-storage'

export const storage: { [key: string]: any } = new MMKV()

export const SyncStorage: {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
} = {
  getItem: (key: string) => storage.getString(key),
  setItem: (key: string, value: string) => {
    storage.set(key, value)
  },
  removeItem: (key: string) => {
    storage.delete(key)
  }
}

// TODO: Remove `hasMigratedFromAsyncStorage` after a while (when everyone has migrated)
export const hasMigratedFromAsyncStorage = storage.getBoolean('hasMigratedFromAsyncStorage')

// TODO: Remove `hasMigratedFromAsyncStorage` after a while (when everyone has migrated)
export async function migrateFromAsyncStorage(): Promise<void> {
  console.log('Migrating from AsyncStorage -> MMKV...')
  // @ts-ignore
  const start = global.performance.now()

  const keys = await AsyncStorage.getAllKeys()

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const value = await AsyncStorage.getItem(key)

      if (value != null) {
        if (['true', 'false'].includes(value)) {
          storage.set(key, value === 'true')
        } else {
          storage.set(key, value)
        }

        AsyncStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Failed to migrate key "${key}" from AsyncStorage to MMKV!`, error)
      throw error
    }
  }

  storage.set('hasMigratedFromAsyncStorage', true)
  // @ts-ignore
  const end = global.performance.now()
  console.log(`Migrated from AsyncStorage -> MMKV in ${end - start}ms!`)
}
