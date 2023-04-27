import { useCallback } from 'react'

import useStorage from '@common/hooks/useStorage'

const STORAGE_KEY = 'dapps_permission'

const usePermission = ({ selectedDappUrl }: { selectedDappUrl: string }) => {
  const [permission, setPermission] = useStorage({
    key: STORAGE_KEY,
    defaultValue: [],
    setInit: (p: any) => (!Array.isArray(p) ? [] : p)
  })

  const hasPermission = useCallback(
    (dappURL: string) => {
      return permission?.includes(dappURL) as boolean
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

  const grantPermission = useCallback(() => {
    if (selectedDappUrl) {
      addPermission(selectedDappUrl)
    } else {
      console.error('selectedDappUrl is undefined')
    }
  }, [selectedDappUrl, addPermission])

  return {
    hasPermission,
    addPermission,
    grantPermission,
    removePermission
  }
}

export default usePermission
