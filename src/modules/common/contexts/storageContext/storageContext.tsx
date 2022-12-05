import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { StorageController } from './storageController'

const StorageContext = createContext<{
  getItem: (key: string) => any
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
  storageControllerInstance: StorageController
}>({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  storageControllerInstance: null
})

const StorageProvider: React.FC = ({ children }) => {
  const storageControllerInstance = useMemo(() => new StorageController(), [])
  const [isInitialized, setIsInitialized] = useState(storageControllerInstance.isInitialized)

  useEffect(() => {
    ;(async () => {
      const unsubscribe = await storageControllerInstance.init()

      setIsInitialized(storageControllerInstance.isInitialized)

      return () => unsubscribe()
    })()
  }, [storageControllerInstance])

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
          removeItem,
          storageControllerInstance
        }),
        [getItem, setItem, removeItem, storageControllerInstance]
      )}
    >
      {isInitialized ? children : null}
    </StorageContext.Provider>
  )
}

export { StorageContext, StorageProvider }
