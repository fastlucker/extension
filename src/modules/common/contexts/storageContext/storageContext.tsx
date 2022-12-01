import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { StorageController } from './storageController'

const StorageContext = createContext<{
  getItem: (key: string) => any
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
}>({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
})

const StorageProvider: React.FC = ({ children }) => {
  const storageControllerInstance = useMemo(() => new StorageController(), [])
  const [isLoaded, setIsLoaded] = useState(storageControllerInstance.isInitialized)

  useEffect(() => {
    ;(async () => {
      await storageControllerInstance.init()

      setIsLoaded(storageControllerInstance.isInitialized)
    })()

    return () => {
      // TODO: stop listening to changes
    }
  }, [storageControllerInstance])

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

  const getItem = useCallback(
    (key: string) => storageControllerInstance.getItem(key),
    [storageControllerInstance]
  )

  const setItem = useCallback(
    (key: string, value: any) => storageControllerInstance.setItem(key, value),
    [storageControllerInstance]
  )

  const removeItem = useCallback(
    (key: string) => storageControllerInstance.removeItem(key),
    [storageControllerInstance]
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
