import { MMKV } from 'react-native-mmkv'

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
