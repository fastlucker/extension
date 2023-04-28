import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Title from '@common/components/Title'
import useNavigation from '@common/hooks/useNavigation'
import text from '@common/styles/utils/text'
import providerController from '@mobile/modules/web3/services/webview-background/provider/provider'
import { Approval } from '@mobile/modules/web3/services/webview-background/services/notification'
import sessionService from '@mobile/modules/web3/services/webview-background/services/session'

import { Web3ContextData } from './types'
import useApproval from './useApproval'
import useNotification from './useNotification'
import usePermission from './usePermission'

const Web3Context = createContext<Web3ContextData>({
  checkHasPermission: () => false,
  addPermission: () => {},
  setSelectedDappUrl: () => {},
  approval: null,
  setApproval: () => {},
  setWeb3ViewRef: () => {},
  handleWeb3Request: () => {},
  requests: null,
  getApproval: () => Promise.resolve(null),
  resolveApproval: () => {},
  rejectApproval: () => {},
  resolveMany: () => {},
  rejectAllApprovals: () => {}
})

const Web3Provider: React.FC<any> = ({ children }) => {
  const { goBack } = useNavigation()
  const {
    ref: sheetRefPermission,
    open: openBottomSheetPermission,
    close: closeBottomSheetPermission
  } = useModalize()

  const [selectedDappUrl, setSelectedDappUrl] = useState<string>('')
  const prevSelectedDappUrl = usePrevious(selectedDappUrl)
  const [web3ViewRef, setWeb3ViewRef] = useState<any>(null)
  const [approval, setApproval] = useState<Approval | null>(null)

  const { checkHasPermission, addPermission, removePermission, grantPermission } = usePermission({
    selectedDappUrl
  })

  const { requestNotificationServiceMethod } = useNotification({
    setApproval
  })

  const {
    requests,
    getApproval,
    resolveApproval,
    rejectApproval,
    resolveMany,
    rejectAllApprovals
  } = useApproval({ requestNotificationServiceMethod, approval, setApproval })

  useEffect(() => {
    if (!prevSelectedDappUrl && selectedDappUrl) {
      if (!checkHasPermission(selectedDappUrl)) {
        setTimeout(() => {
          openBottomSheetPermission()
        }, 1)
      }
    }
  }, [checkHasPermission, openBottomSheetPermission, prevSelectedDappUrl, selectedDappUrl])

  useEffect(() => {
    if ((!selectedDappUrl || !web3ViewRef) && requests.length) {
      rejectAllApprovals()
      setApproval(null)
    }
  }, [requests, selectedDappUrl, web3ViewRef, rejectAllApprovals])

  const handleWeb3Request = useCallback(
    async ({ data }: { data: any }) => {
      try {
        if (data.method === 'disconnect') {
          removePermission(selectedDappUrl)
          return
        }

        const sessionId = selectedDappUrl
        const origin = selectedDappUrl
        const session = sessionService.getOrCreateSession(sessionId, origin, web3ViewRef)
        const req = { data, session, origin }

        const result = await providerController(req, requestNotificationServiceMethod)
        console.log('result', result)

        const response = {
          id: data.id,
          method: data.method,
          success: true, // or false if there is an error
          result // or error: {} if there is an error
        }

        if (result) {
          web3ViewRef?.injectJavaScript(`handleProviderResponse(${JSON.stringify(response)});`)
        }
      } catch (error) {
        const response = {
          id: data.id,
          method: data.method,
          success: false, // or false if there is an error
          error // or error: {} if there is an error
        }
        web3ViewRef?.injectJavaScript(`handleProviderResponse(${JSON.stringify(response)});`)
      }
    },
    [web3ViewRef, selectedDappUrl, requestNotificationServiceMethod, removePermission]
  )

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          setWeb3ViewRef,
          checkHasPermission,
          addPermission,
          setSelectedDappUrl,
          approval,
          setApproval,
          handleWeb3Request,
          requests,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany,
          rejectAllApprovals
        }),
        [
          checkHasPermission,
          addPermission,
          approval,
          setApproval,
          handleWeb3Request,
          requests,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany,
          rejectAllApprovals
        ]
      )}
    >
      {children}
      <BottomSheet
        id="allow-dapp-to-connect"
        sheetRef={sheetRefPermission}
        closeBottomSheet={() => {
          setTimeout(() => {
            if (!checkHasPermission(selectedDappUrl)) {
              closeBottomSheetPermission()
              goBack()
            } else {
              closeBottomSheetPermission()
            }
          }, 10)
        }}
      >
        <Title style={text.center}>Allow dApp to Connect</Title>
        <Button text="Allow" onPress={grantPermission} />
      </BottomSheet>
    </Web3Context.Provider>
  )
}

export { Web3Context, Web3Provider }
