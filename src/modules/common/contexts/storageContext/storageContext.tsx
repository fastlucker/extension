import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { browserAPI } from '@web/constants/browserAPI'
import { BACKGROUND } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

// TODO: type
const StorageContext = createContext<{
  getItem: (key: string) => any
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
}>({
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

      // TODO: Figure out how to set network, networkId and selectedAccount.
      // Note: local storage keeps only the networkId
      // but the background service needs the whole network object
      // Note: old implementation:
      // store.network = network || {}
      // store.selectedAcc = selectedAccount || ''
      // browserAPI?.storage?.local?.set(store)
      // Note: new implementation:
      // await Promise.all([
      //   await requestStorageControllerMethod({
      //     method: 'setItem',
      //     props: {
      //       key: networkId,
      //       data: network.id
      //     }
      //   })

      //   await requestStorageControllerMethod({
      //     method: 'setItem',
      //     props: {
      //       key: network,
      //       data: network
      //     }
      //   })

      //   await requestStorageControllerMethod({
      //     method: 'setItem',
      //     props: {
      //       key: network,
      //       data: network
      //     }
      //   })
      // ])

      setIsLoaded(true)
    })()
  }, [])

  // TODO: Figure out if this is still needed
  // Syncs browser async storage with the extension's local storage
  // Browser local storage used mainly in the extension's background service
  // useMMKVListener(async (key) => {
  //   const store: any = await getStore()
  //   const value = SyncStorage.getItem(key)
  //   let parsedValue
  //   try {
  //     parsedValue = JSON.parse(value as string)
  //   } catch (e) {
  //     parsedValue = value
  //   }
  //   store[key] = parsedValue
  //   // local storage keeps only the networkId
  //   // but the background service needs the whole network object
  //   store.network = network || {}
  //   store.selectedAcc = selectedAccount || ''
  //   browserAPI?.storage?.local?.set(store)
  // })

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
