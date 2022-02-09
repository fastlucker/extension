import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { Storage } from '@modules/common/hooks/useStorage/useStorage'
import AsyncStorage from '@react-native-async-storage/async-storage'

type StorageContextData = {
  storage: { [key: string]: any } | null
  storageLoaded: boolean
  SyncStorage: Storage
}

const StorageContext = createContext<StorageContextData>({
  storage: null,
  storageLoaded: false,
  SyncStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  }
})

const StorageProvider: React.FC = ({ children }) => {
  const [storage, setStorage] = useState<{ [key: string]: any }>([])

  useEffect(() => {
    ;(async () => {
      const keys = await AsyncStorage.getAllKeys()
      AsyncStorage.multiGet(keys).then((data) => {
        const storedData = Object.assign({}, ...data.map((d) => ({ [`${d[0]}`]: d[1] })))
        setStorage(storedData)
      })
    })()
  }, [])

  const storageLoaded = useCallback(
    () => !!Object.keys(storage)?.length || storage !== null,
    [storage]
  )

  const SyncStorage: StorageContextData['SyncStorage'] = {
    getItem: (key: string) => storage[key],
    setItem: (key: string, value: any) => {
      AsyncStorage.setItem(key, value)
      setStorage((prevStorage: any) => {
        return { ...prevStorage, [key]: value }
      })
    },
    removeItem: (key: string) => {
      AsyncStorage.removeItem(key)
      setStorage((prevStorage: any) => {
        return { ...prevStorage, [key]: null }
      })
    }
  }

  return (
    <StorageContext.Provider
      value={useMemo(
        () => ({
          storage,
          storageLoaded: storageLoaded(),
          SyncStorage
        }),
        [storage, storageLoaded]
      )}
    >
      {children}
    </StorageContext.Provider>
  )
}

export { StorageContext, StorageProvider }
