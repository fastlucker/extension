import React, { createContext, useEffect, useMemo, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

type StorageContextData = {
  storageLoaded: boolean
}

const StorageContext = createContext<StorageContextData>({
  storageLoaded: false
})

// eslint-disable-next-line import/no-mutable-exports
export let storage: { [key: string]: any } = {}

export const SyncStorage: {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
} = {
  getItem: (key: string) => storage[key],
  setItem: (key: string, value: any) => {
    AsyncStorage.setItem(key, value)
    storage = { ...storage, [key]: value }
  },
  removeItem: (key: string) => {
    AsyncStorage.removeItem(key)
    storage = { ...storage, [key]: null }
  }
}

const StorageProvider: React.FC = ({ children }) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      const keys = await AsyncStorage.getAllKeys()
      AsyncStorage.multiGet(keys).then((data) => {
        const storedData = Object.assign({}, ...data.map((d) => ({ [`${d[0]}`]: d[1] })))
        storage = storedData
        setLoaded(true)
      })
    })()
  }, [])

  return (
    <StorageContext.Provider
      value={useMemo(
        () => ({
          storageLoaded: loaded
        }),
        [loaded]
      )}
    >
      {children}
    </StorageContext.Provider>
  )
}

export { StorageContext, StorageProvider }
