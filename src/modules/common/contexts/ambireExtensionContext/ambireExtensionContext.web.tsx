import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useAccounts from '@modules/common/hooks/useAccounts'
import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'
import alert from '@modules/common/services/alert'
import { getCurrentTab } from '@web/background/webapi/tab'
import { errorCodes } from '@web/constants/errors'
import { USER_INTERVENTION_METHODS } from '@web/constants/userInterventionMethods'
import getOriginFromUrl from '@web/utils/getOriginFromUrl'

import { ambireExtensionContextDefaults, AmbireExtensionContextReturnType } from './types'

const AmbireExtensionContext = createContext<AmbireExtensionContextReturnType>(
  ambireExtensionContextDefaults
)

const STORAGE_KEY = 'ambire_extension_state'

const AmbireExtensionProvider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const { selectedAcc: selectedAccount } = useAccounts()
  const { network } = useNetwork()
  const { extensionWallet } = useExtensionWallet()
  const [site, setSite] = useState<AmbireExtensionContextReturnType['site']>(null)
  const [connectedDapps, setConnectedDapps] = useState<
    AmbireExtensionContextReturnType['connectedDapps']
  >([])
  const [params, setParams] = useState<{
    route?: string
    host?: string
    queue?: string
  }>({})
  const queue = useMemo(() => (params.queue ? JSON.parse(atob(params.queue)) : []), [params.queue])

  const getCurrentSite = useCallback(async () => {
    const tab = await getCurrentTab()
    if (!tab.id || !tab.url) return
    const domain = getOriginFromUrl(tab.url)
    const current = await extensionWallet.getCurrentSite(tab.id, domain)
    setSite(current)
  }, [extensionWallet])

  const getConnectedSites = useCallback(async () => {
    const connectedSites = await extensionWallet.getConnectedSites()
    setConnectedDapps(connectedSites)
  }, [extensionWallet])

  useEffect(() => {
    getCurrentSite()
    getConnectedSites()
  }, [getCurrentSite, getConnectedSites])

  const [requests, setRequests] = useStorage({
    key: STORAGE_KEY,
    defaultValue: [],
    setInit: (initialRequests) => (!Array.isArray(initialRequests) ? [] : initialRequests)
  })

  // eth_sign, personal_sign
  const handlePersonalSign = useCallback(
    async (message) => {
      const payload = message.data

      if (!payload) {
        console.error('AmbExHook: no payload', message)
        return
      }

      const id = `ambex_${payload.id}`
      let messageToSign = payload?.params?.message || payload?.params[0]
      if (
        payload.method === USER_INTERVENTION_METHODS.eth_sign ||
        payload.method === USER_INTERVENTION_METHODS.eth_signTypedData ||
        payload.method === USER_INTERVENTION_METHODS.eth_signTypedData_v4
      ) {
        messageToSign = payload?.params[1]
      }
      if (!messageToSign) {
        console.error('AmbExHook: no message in received payload')
        return
      }

      const request = {
        id,
        originalPayloadId: payload.id, // id for internal ambire requests purposes, originalPayloadId, to return
        type: payload.method,
        txn: messageToSign,
        chainId: network?.chainId,
        account: selectedAccount,
        originalMessage: message
      }

      setRequests((prevRequests) =>
        prevRequests.find((x) => x.id === request.id) ? prevRequests : [...prevRequests, request]
      )
    },
    [network?.chainId, selectedAccount, setRequests]
  )

  // handleSendTx
  const handleSendTransactions = useCallback(
    async (message) => {
      const payload = message.data
      const txs = payload.params
      if (txs?.length) {
        // eslint-disable-next-line no-restricted-syntax
        for (const i in txs) {
          if (!txs[i].from) txs[i].from = selectedAccount
        }
      } else {
        throw Error('No txs in received payload')
      }

      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const ix in txs) {
        const internalHookId = `ambex_tx_${payload.id}:${ix}`
        const request = {
          id: internalHookId,
          originalPayloadId: payload.id,
          type: 'eth_sendTransaction',
          isBatch: txs.length > 1,
          txn: txs[ix],
          chainId: network?.chainId,
          account: selectedAccount,
          originalMessage: message
        }
        // Do we need reducer here or enough like this?
        setRequests((prevRequests) =>
          prevRequests.find((x) => x.id === request.id) ? prevRequests : [...prevRequests, request]
        )
      }
    },
    [network?.chainId, selectedAccount, setRequests]
  )

  const resolveMany = useCallback(
    (ids, resolution) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const req of requests.filter((x) => ids.includes(x.id))) {
        // only process non batch or first batch req
        if (!req.isBatch || req.id.endsWith(':0')) {
          const rpcResult: any = {
            jsonrpc: '2.0',
            id: req.originalPayloadId,
            txId: null,
            hash: null,
            result: null,
            success: null,
            error: null
          }

          if (!resolution) {
            rpcResult.error = { code: errorCodes.rpc.methodNotFound, message: 'Nothing to resolve' }
            rpcResult.success = false
          } else if (!resolution.success) {
            rpcResult.error = resolution
            rpcResult.success = false
          } else {
            // onSuccess
            rpcResult.success = true
            rpcResult.txId = resolution.result
            rpcResult.hash = resolution.result
            rpcResult.result = resolution.result
          }

          // TODO:
          // !!sendMessage &&
          //   sendMessage({
          //     type: 'web3CallResponse',
          //     to: BACKGROUND,
          //     data: {
          //       originalMessage: req.originalMessage,
          //       rpcResult
          //     }
          //   })
        }
      }
      setRequests((prevRequests) => prevRequests.filter((x) => !ids.includes(x.id)))
    },
    [requests, setRequests]
  )

  const disconnectDapp = useCallback<AmbireExtensionContextReturnType['disconnectDapp']>(
    (origin) => {
      const siteToDisconnect = connectedDapps.find((x) => x.origin === origin)

      if (!siteToDisconnect) {
        return
      }

      const disconnect = async () => {
        await extensionWallet.removeConnectedSite(origin)
        getCurrentSite()
        getConnectedSites()
      }

      alert(
        t('Are you sere you want to disconnect {{name}} ({{url}})?', {
          name: siteToDisconnect.name,
          url: siteToDisconnect.origin
        }),
        undefined,
        [
          { text: t('Disconnect'), onPress: disconnect, style: 'destructive' },
          { text: t('Cancel'), style: 'cancel' }
        ]
      )
    },
    [connectedDapps, extensionWallet, getConnectedSites, getCurrentSite, t]
  )

  useEffect(() => {
    const message = queue[0]
    if (message) {
      if (
        params.route === USER_INTERVENTION_METHODS.eth_sendTransaction ||
        params.route === USER_INTERVENTION_METHODS.gs_multi_send ||
        params.route === USER_INTERVENTION_METHODS.ambire_sendBatchTransaction
      ) {
        handleSendTransactions(message)
      }
      if (
        params.route === USER_INTERVENTION_METHODS.eth_sign ||
        params.route === USER_INTERVENTION_METHODS.personal_sign ||
        params.route === USER_INTERVENTION_METHODS.eth_signTypedData ||
        params.route === USER_INTERVENTION_METHODS.eth_signTypedData_v4
      ) {
        handlePersonalSign(message)
      }
    }
  }, [params, queue, handleSendTransactions, handlePersonalSign])

  return (
    <AmbireExtensionContext.Provider
      value={useMemo(
        () => ({
          connectedDapps,
          params,
          requests,
          site,
          resolveMany,
          setParams,
          disconnectDapp
        }),
        [connectedDapps, params, requests, site, resolveMany, setParams, disconnectDapp]
      )}
    >
      {children}
    </AmbireExtensionContext.Provider>
  )
}

export { AmbireExtensionContext, AmbireExtensionProvider }
