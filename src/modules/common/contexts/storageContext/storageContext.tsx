import React, { createContext, useCallback, useMemo } from 'react'

import useAuth from '@modules/auth/hooks/useAuth'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'
import VaultController from '@modules/vault/services/VaultController'
import { BACKGROUND } from '@web/constants/paths'
import { sendMessage } from '@web/services/ambexMessanger'

// TODO: type
const StorageContext = createContext<any>({
  getItem:
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
  // TODO: Make this sync!
  const getItem = useCallback(async (props: { key: string }) => {
    const res = await requestStorageControllerMethod({
      method: 'getItem',
      props
    })

    return res
  }, [])

  return (
    <StorageContext.Provider
      value={useMemo(
        () => ({
          getItem
        }),
        [getItem]
      )}
    >
      {children}
    </StorageContext.Provider>
  )
}

export { StorageContext, StorageProvider }
