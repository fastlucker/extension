import usePrevious from 'ambire-common/src/hooks/usePrevious'
import { serializeError } from 'eth-rpc-errors'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Title from '@common/components/Title'
import useNavigation from '@common/hooks/useNavigation'
import colors from '@common/styles/colors'
import text from '@common/styles/utils/text'
import SwitchNetworkRequest from '@mobile/modules/web3/components/SwitchNetworkRequest'
import providerController from '@mobile/modules/web3/services/webview-background/provider/provider'
import { Approval } from '@mobile/modules/web3/services/webview-background/services/notification'
import sessionService from '@mobile/modules/web3/services/webview-background/services/session'

import { Web3ContextData } from './types'
import useApproval from './useApproval'
import useNotification from './useNotification'
import usePermission from './usePermission'

const Web3Context = createContext<Web3ContextData>({
  approval: null,
  requests: null,
  checkHasPermission: () => false,
  addPermission: () => {},
  setSelectedDappUrl: () => {},
  setApproval: () => {},
  setWeb3ViewRef: () => {},
  handleWeb3Request: () => {},
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
  const {
    ref: sheetRefSwitchNetwork,
    open: openBottomSheetSwitchNetwork,
    close: closeBottomSheetSwitchNetwork
  } = useModalize()

  const [selectedDappUrl, setSelectedDappUrl] = useState<string>('')
  const prevSelectedDappUrl = usePrevious(selectedDappUrl)
  const [web3ViewRef, setWeb3ViewRef] = useState<any>(null)
  const [approval, setApproval] = useState<Approval | null>(null)
  const prevApproval = usePrevious(approval)
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

  useEffect(() => {
    if (
      prevApproval?.data?.approvalComponent !== 'SwitchNetwork' &&
      approval?.data?.approvalComponent === 'SwitchNetwork'
    ) {
      openBottomSheetSwitchNetwork()
    }
  }, [approval, prevApproval, openBottomSheetSwitchNetwork])

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

        console.log(data)
        const result = await providerController(req, requestNotificationServiceMethod)
        console.log('result', result)

        const response = { id: data.id, result }

        web3ViewRef?.injectJavaScript(`
            if (window.ethereum.promises[${response.id}]) {
              window.ethereum.promises[${response.id}].resolve(${JSON.stringify(response.result)});
              delete window.ethereum.promises[${response.id}]
            }
          `)
      } catch (error) {
        const response = { id: data.id, error }

        web3ViewRef?.injectJavaScript(`
        if (window.ethereum.promises[${response.id}]) {
          window.ethereum.promises[${response.id}].reject(${JSON.stringify(
          serializeError({ message: error.message || 'User rejected the request.' })
        )});
          delete window.ethereum.promises[${response.id}]
        }
      `)
      }
    },
    [web3ViewRef, selectedDappUrl, requestNotificationServiceMethod, removePermission]
  )

  return (
    <Web3Context.Provider
      value={useMemo(
        () => ({
          approval,
          requests,
          setWeb3ViewRef,
          checkHasPermission,
          addPermission,
          setSelectedDappUrl,
          setApproval,
          handleWeb3Request,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany,
          rejectAllApprovals
        }),
        [
          approval,
          requests,
          checkHasPermission,
          addPermission,
          setApproval,
          handleWeb3Request,
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
        <Button
          text="Allow"
          onPress={() => {
            grantPermission()
            closeBottomSheetPermission()
          }}
        />
      </BottomSheet>
      <BottomSheet
        id="switch-network-approval"
        sheetRef={sheetRefSwitchNetwork}
        closeBottomSheet={closeBottomSheetSwitchNetwork}
        style={{ backgroundColor: colors.martinique }}
      >
        <SwitchNetworkRequest isInBottomSheet closeBottomSheet={closeBottomSheetSwitchNetwork} />
      </BottomSheet>
    </Web3Context.Provider>
  )
}

export { Web3Context, Web3Provider }
