import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { browserAPI } from '@web/constants/browserAPI'
import { BACKGROUND } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

// TODO: type
const StorageContext = createContext<any>({
  getItem: () => {},
  setItem: () => {},
  removeItem: () => {}
})

const requestStorageControllerMethod = ({
  method,
  props
}: {
  method: string
  props?: { [key: string]: any }
}) => {
  return new Promise((resolve, reject) => {
    sendMessage({
      type: 'storageController',
      to: BACKGROUND,
      data: {
        method,
        props
      }
    })
      .then((res: any) => resolve(res.data))
      .catch((err) => reject(err))
  })
}

const StorageProvider: React.FC = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [storage, setStorage] = useState<any>({})

  const handleOnStorageChange = useCallback(
    (changes: { [key: string]: { newValue: any; oldValue: any } }, namespace: string) => {
      if (namespace === 'local') {
        const allKeysChanged = Object.keys(changes)

        const nextStorage = { ...storage }
        allKeysChanged.forEach((key: string) => {
          nextStorage[key] = changes[key].newValue
        })

        setStorage(nextStorage)
      }
    },
    [storage]
  )

  useEffect(() => {
    browserAPI.storage.onChanged.addListener(handleOnStorageChange)

    return () => browserAPI.storage.onChanged.removeListener(handleOnStorageChange)
  }, [handleOnStorageChange])

  useEffect(() => {
    ;(async () => {
      const storageComingFromTheBackgroundProcess = await requestStorageControllerMethod({
        method: 'getStorage'
      })

      setStorage(storageComingFromTheBackgroundProcess)
      setIsLoaded(true)
    })()
  }, [])

  const getItem = useCallback((key: string) => storage[key], [storage])

  const setItem = useCallback(
    (key: string, value: any) => {
      storage[key] = value

      requestStorageControllerMethod({
        method: 'setItem',
        props: { key, value }
      })
    },
    [storage]
  )

  const removeItem = useCallback(
    (key: string) => {
      const nextStorage = { ...storage }
      delete nextStorage[key]

      setStorage(nextStorage)

      requestStorageControllerMethod({
        method: 'removeItem',
        props: { key }
      })
    },
    [storage]
  )

  return (
    <StorageContext.Provider
      value={useMemo(
        () => ({
          getItem,
          setItem,
          removeItem
        }),
        [getItem, setItem, removeItem]
      )}
    >
      {isLoaded ? children : null}
    </StorageContext.Provider>
  )
}

export { StorageContext, StorageProvider }
