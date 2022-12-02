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
