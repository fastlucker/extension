import React, { createContext, useCallback, useMemo } from 'react'

import useStorage from '@common/hooks/useStorage'

type PermissionContextData = {
  hasPermission: (dappURL: string) => boolean
  addPermission: (dappURL: string) => void
  removePermission: (dappURL: string) => void
}

const PermissionContext = createContext<PermissionContextData>({
  hasPermission: () => false,
  addPermission: () => {},
  removePermission: () => {}
})

const STORAGE_KEY = 'dapps_permission'

const PermissionProvider: React.FC<any> = ({ children }) => {
  const [permission, setPermission] = useStorage({
    key: STORAGE_KEY,
    defaultValue: [],
    setInit: (p: any) => (!Array.isArray(p) ? [] : p)
  })

  const hasPermission = useCallback(
    (dappURL: string) => {
      return permission?.includes(dappURL)
    },
    [permission]
  )

  const addPermission = useCallback(
    (dappURL: string) => {
      if (!hasPermission(dappURL)) {
        permission?.push(dappURL)
        setPermission(permission)
      }
    },
    [permission, setPermission, hasPermission]
  )

  const removePermission = useCallback(
    (dappURL: string) => {
      setPermission(permission ? permission?.filter((url: string) => url !== dappURL) : [])
    },
    [permission, setPermission]
  )

  return (
    <PermissionContext.Provider
      value={useMemo(
        () => ({
          hasPermission,
          addPermission,
          removePermission
        }),
        [hasPermission, addPermission, removePermission]
      )}
    >
      {children}
    </PermissionContext.Provider>
  )
}

export { PermissionContext, PermissionProvider }
