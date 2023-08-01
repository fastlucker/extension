import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { isExtension } from '@web/constants/browserapi'
import useBackgroundService from '@web/hooks/useBackgroundService'

import { StorageController } from './storageController'

const StorageContext = createContext<{
  getItem: (key: string) => any
  setItem: (key: string, value: any) => void
  removeItem: (key: string) => void
  storageControllerInstance?: StorageController
}>({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
})

const StorageProvider: React.FC = ({ children }) => {
  const { dispatch } = useBackgroundService()
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
    (key: string, value: any) => {
      if (isExtension) {
        dispatch({ type: 'WALLET_CONTROLLER_SET_STORAGE', params: { key, value } })
      }

      return storageControllerInstance.setItem(key, value)
    },
    [storageControllerInstance, dispatch]
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
