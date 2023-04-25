import React, { createContext, useCallback, useMemo, useState } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Title from '@common/components/Title'
import useNavigation from '@common/hooks/useNavigation'
import useStorage from '@common/hooks/useStorage'

type PermissionContextData = {
  hasPermission: (dappURL: string) => boolean
  addPermission: (dappURL: string) => void
  removePermission: (dappURL: string) => void
  setSelectedDappUrl: React.Dispatch<React.SetStateAction<string>>
  openBottomSheetPermission: (dest?: 'top' | 'default' | undefined) => void
}

const PermissionContext = createContext<PermissionContextData>({
  hasPermission: () => false,
  addPermission: () => {},
  removePermission: () => {},
  setSelectedDappUrl: () => {},
  openBottomSheetPermission: () => {}
})

const STORAGE_KEY = 'dapps_permission'

const PermissionProvider: React.FC<any> = ({ children }) => {
  const [permission, setPermission] = useStorage({
    key: STORAGE_KEY,
    defaultValue: [],
    setInit: (p: any) => (!Array.isArray(p) ? [] : p)
  })
  const { goBack } = useNavigation()
  const {
    ref: sheetRefPermission,
    open: openBottomSheetPermission,
    close: closeBottomSheetPermission
  } = useModalize()
  const [selectedDappUrl, setSelectedDappUrl] = useState<string>('')

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

  return (
    <PermissionContext.Provider
      value={useMemo(
        () => ({
          hasPermission,
          addPermission,
          removePermission,
          setSelectedDappUrl,
          openBottomSheetPermission
        }),
        [hasPermission, addPermission, removePermission, openBottomSheetPermission]
      )}
    >
      {children}
      <BottomSheet
        id="allow-dapp-to-connect"
        sheetRef={sheetRefPermission}
        closeBottomSheet={() => {
          setTimeout(() => {
            if (!hasPermission(selectedDappUrl)) {
              closeBottomSheetPermission()
              goBack()
            } else {
              closeBottomSheetPermission()
            }
          }, 10)
        }}
      >
        <Title>Allow dApp to Connect</Title>
        <Button text="Allow" onPress={grantPermission} />
      </BottomSheet>
    </PermissionContext.Provider>
  )
}

export { PermissionContext, PermissionProvider }
