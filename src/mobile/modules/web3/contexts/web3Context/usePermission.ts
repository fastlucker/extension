import { useCallback } from 'react'
import { useModalize } from 'react-native-modalize'

import useStorage from '@common/hooks/useStorage'

const STORAGE_KEY = 'dapps_permission'
const usePermission = ({ selectedDappUrl }: { selectedDappUrl: string }) => {
  const [permission, setPermission] = useStorage<string[] | null>({
    key: STORAGE_KEY,
    defaultValue: []
  })

  const {
    ref: sheetRefPermission,
    open: openBottomSheetPermission,
    close: closeBottomSheetPermission
  } = useModalize()

  const checkHasPermission = useCallback(
    (dappURL: string) => {
      if (dappURL.includes('www.google.com')) return true

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
    removePermission,
    sheetRefPermission,
    openBottomSheetPermission,
    closeBottomSheetPermission
  }
}

export default usePermission
