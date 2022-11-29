import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

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
  // TODO: define props
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

  useEffect(() => {
    ;(async () => {
      console.log('hello')

      const res = await requestStorageControllerMethod({
        method: 'getItem',
        props: { key: '' }
      })

      console.log('storage coming here', res)

      setStorage(res)
      setIsLoaded(true)
    })()
  }, [])

  // TODO: Make this sync!
  const getItem = useCallback(
    (key) => {
      return storage[key]

      // const res = await requestStorageControllerMethod({
      //   method: 'getItem',
      //   props: { key }
      // })

      // return res
    },
    [storage]
  )

  const setItem = useCallback(
    (key: string, value: any) => {
      storage[key] = value

      requestStorageControllerMethod({
        method: 'setItem',
        props: { key, value }
      })

      // const res = await requestStorageControllerMethod({
      //   method: 'setItem',
      //   props: { key, value }
      // })

      // return res
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

      // const res = await requestStorageControllerMethod({
      //   method: 'removeItem',
      //   props: { key }
      // })

      // return res
    },
    [storage]
  )

  return (
    <StorageContext.Provider
      value={useMemo(
        () => ({
          getItem,
          setItem,
          removeItem,
          isLoaded
        }),
        [getItem, setItem, removeItem, isLoaded]
      )}
    >
      {isLoaded ? children : null}
    </StorageContext.Provider>
  )
}

export { StorageContext, StorageProvider }
