import React, { createContext, useMemo, useState } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Title from '@common/components/Title'
import useNavigation from '@common/hooks/useNavigation'
import { Approval } from '@mobile/modules/web3/services/webview-background/services/notification'

import useNotification from './useNotification'
import usePermission from './usePermission'

type Web3ContextData = {
  hasPermission: (dappURL: string) => boolean
  addPermission: (dappURL: string) => void
  removePermission: (dappURL: string) => void
  setSelectedDappUrl: React.Dispatch<React.SetStateAction<string>>
  openBottomSheetPermission: (dest?: 'top' | 'default' | undefined) => void
  requestNotificationServiceMethod: ({
    method,
    props
  }: {
    method: string
    props?: { [key: string]: any }
  }) => any
  approval: Approval | null
  setApproval: React.Dispatch<React.SetStateAction<Approval | null>>
  setWeb3ViewRef: React.Dispatch<any>
}

const Web3Context = createContext<Web3ContextData>({
  hasPermission: () => false,
  addPermission: () => {},
  removePermission: () => {},
  setSelectedDappUrl: () => {},
  openBottomSheetPermission: () => {},
  requestNotificationServiceMethod: () => {},
  approval: null,
  setApproval: () => {},
  setWeb3ViewRef: () => {}
})

const Web3Provider: React.FC<any> = ({ children }) => {
  const { goBack } = useNavigation()
  const {
    ref: sheetRefPermission,
    open: openBottomSheetPermission,
    close: closeBottomSheetPermission
  } = useModalize()

  const [selectedDappUrl, setSelectedDappUrl] = useState<string>('')
  const [web3ViewRef, setWeb3ViewRef] = useState<any>(null)
  const [approval, setApproval] = useState<Approval | null>(null)

  const { hasPermission, addPermission, removePermission, grantPermission } = usePermission({
    selectedDappUrl
  })

  const { requestNotificationServiceMethod } = useNotification({
    web3ViewRef,
    setApproval
  })

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          setWeb3ViewRef,
          hasPermission,
          addPermission,
          removePermission,
          setSelectedDappUrl,
          openBottomSheetPermission,
          requestNotificationServiceMethod,
          approval,
          setApproval
        }),
        [
          hasPermission,
          addPermission,
          removePermission,
          openBottomSheetPermission,
          requestNotificationServiceMethod,
          approval,
          setApproval
        ]
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
    </Web3Context.Provider>
  )
}

export { Web3Context, Web3Provider }
