import networks, { NetworkType } from 'ambire-common/src/constants/networks'
import usePrevious from 'ambire-common/src/hooks/usePrevious'
import { serializeError } from 'eth-rpc-errors'
import { intToHex } from 'ethereumjs-util'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import useAccounts from '@common/hooks/useAccounts'
import useNetwork from '@common/hooks/useNetwork'
import ApprovalBottomSheets from '@mobile/modules/web3/components/ApprovalBottomSheets'
import DappJsonRpcProvider from '@mobile/modules/web3/services/dappProvider/DappJsonRpcProvider'
import providerController from '@mobile/modules/web3/services/webview-background/provider/provider'
import { Approval } from '@mobile/modules/web3/services/webview-background/services/notification'
import sessionService, {
  Session
} from '@mobile/modules/web3/services/webview-background/services/session'
import { DAPP_PROVIDER_URLS } from '@web/extension-services/inpage/config/dapp-providers'

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
  const { selectedAcc } = useAccounts()
  const { network } = useNetwork()
  const [selectedDappUrl, setSelectedDappUrl] = useState<string>('')
  const prevSelectedDappUrl = usePrevious(selectedDappUrl)
  const [web3ViewRef, setWeb3ViewRef] = useState<any>(null)
  const prevWeb3ViewRef = usePrevious(web3ViewRef)
  const [approval, setApproval] = useState<Approval | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [tabSessionData, setTabSessionData] = useState(null)
  const {
    checkHasPermission,
    addPermission,
    removePermission,
    grantPermission,
    sheetRefPermission,
    openBottomSheetPermission,
    closeBottomSheetPermission
  } = usePermission({
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
    if ((!selectedDappUrl && !!prevSelectedDappUrl) || (!web3ViewRef && !!prevWeb3ViewRef)) {
      rejectAllApprovals()
      setApproval(null)
      setSession(null)
      setTabSessionData(null)
    }
  }, [
    requests,
    selectedDappUrl,
    prevSelectedDappUrl,
    web3ViewRef,
    prevWeb3ViewRef,
    rejectAllApprovals
  ])

  const handleWeb3Request = useCallback(
    async ({ data }: { data: any }) => {
      try {
        if (!checkHasPermission(selectedDappUrl) && data.method === 'tabCheckin') {
          setTabSessionData(data)
          openBottomSheetPermission()
          return
        }

        if (data.method === 'disconnect') {
          removePermission(selectedDappUrl)
          return
        }

        const sessionId = selectedDappUrl
        const origin = selectedDappUrl
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const s = sessionService.getOrCreateSession(sessionId, origin, web3ViewRef)
        const req = { data, session: s, origin }

        if (!session) {
          setSession(session)
        }

        let result: any

        const dappProvider = DAPP_PROVIDER_URLS?.[data?.hostname]
        if (data.handleRequestByDappProvider && dappProvider) {
          const net: NetworkType =
            networks.find((n) => intToHex(n.chainId) === data?.chainId) || (network as NetworkType)
          const providerUrl = dappProvider?.[net?.id]
          if (providerUrl) {
            try {
              if (!providerUrl.startsWith('wss:')) {
                const provider = new DappJsonRpcProvider(
                  { url: providerUrl, origin: data.origin },
                  {
                    name: net?.name,
                    chainId: net?.chainId
                  }
                )

                result = await provider.send(data.method, data.params)
              }
            } catch (e) {
              console.error('dapp provider error', e)
            }
          }
        }

        if (!result) {
          result = await providerController(req, requestNotificationServiceMethod)
          console.log('result', result)
        }

        const response = { id: data.id, result: data.method === 'tabCheckin' ? true : result }

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
    [
      web3ViewRef,
      selectedDappUrl,
      session,
      requestNotificationServiceMethod,
      removePermission,
      checkHasPermission,
      openBottomSheetPermission,
      network
    ]
  )

  useEffect(() => {
    if (network && selectedDappUrl) {
      const networkChange = (net: NetworkType) => {
        sessionService.broadcastEvent('chainChanged', {
          chain: intToHex(net.chainId),
          networkVersion: `${net.chainId}`
        })
      }

      networkChange(network)
    }
  }, [network, selectedDappUrl])

  useEffect(() => {
    if (selectedAcc && selectedDappUrl) {
      const accountChange = (acc: string) => {
        const account = acc ? [acc] : []
        sessionService.broadcastEvent('accountsChanged', account)
      }

      accountChange(selectedAcc)
    }
  }, [selectedAcc, selectedDappUrl])

  const handleGrantPermission = async () => {
    grantPermission()
    setTimeout(() => {
      handleWeb3Request({ data: tabSessionData })
    }, 100)
  }

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
      <ApprovalBottomSheets
        approval={approval}
        resolveApproval={resolveApproval}
        rejectApproval={rejectApproval}
        selectedDappUrl={selectedDappUrl}
        checkHasPermission={checkHasPermission}
        grantPermission={handleGrantPermission}
        sheetRefPermission={sheetRefPermission}
        closeBottomSheetPermission={closeBottomSheetPermission}
        tabSessionData={tabSessionData}
      />
    </Web3Context.Provider>
  )
}

export { Web3Context, Web3Provider }
