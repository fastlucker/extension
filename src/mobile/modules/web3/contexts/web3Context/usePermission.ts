import { useCallback } from 'react'

import useStorage from '@common/hooks/useStorage'

const STORAGE_KEY = 'dapps_permission'

const usePermission = ({ selectedDappUrl }: { selectedDappUrl: string }) => {
  const [permission, setPermission] = useStorage<string[] | null>({
    key: STORAGE_KEY,
    defaultValue: []
  })

  const checkHasPermission = useCallback(
    (dappURL: string) => {
      return permission?.includes(dappURL) as boolean
    },
    [permission]
  )

  const addPermission = useCallback(
    (dappURL: string) => {
      if (!checkHasPermission(dappURL)) {
        permission?.push(dappURL)
        // @ts-ignore
        setPermission([...permission])
      }
    },
    [permission, setPermission, checkHasPermission]
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
      console.error('selectedDappUrl is not defined')
    }
  }, [selectedDappUrl, addPermission])

  return {
    checkHasPermission,
    addPermission,
    grantPermission,
    removePermission
  }
}

export default usePermission
