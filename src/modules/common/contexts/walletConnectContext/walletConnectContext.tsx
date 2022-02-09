import React, { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
// eslint-disable-next-line import/no-extraneous-dependencies
import WalletConnectCore from '@walletconnect/core'
// eslint-disable-next-line import/no-extraneous-dependencies
import * as cryptoLib from '@walletconnect/iso-crypto'

type WalletConnectContextData = {
  connections: any[]
  requests: any[]
  resolveMany: (ids: any, resolution: any) => void
  connect: (opts: any) => any
  disconnect: (uri: string) => void
  handleConnect: (uri: string) => void
}

const WalletConnectContext = createContext<WalletConnectContextData>({
  connections: [],
  requests: [],
  resolveMany: () => {},
  connect: () => {},
  disconnect: () => {},
  handleConnect: () => {}
})

const noop = () => null
const noopSessionStorage: any = { setSession: noop, getSession: noop, removeSession: noop }

const STORAGE_KEY = 'wc1_state'
const SUPPORTED_METHODS = ['eth_sendTransaction', 'gs_multi_send', 'personal_sign', 'eth_sign']
const SESSION_TIMEOUT = 10000

const getDefaultState = () => ({ connections: [], requests: [] })

const connectors: any = {}
let connectionErrors: any = []

// Offline check: if it errored recently
const timePastForConnectionErr = 90 * 1000
const checkIsOffline = (uri: any) => {
  const errors = connectionErrors.filter((x) => x.uri === uri)
  return errors.find(({ time }: any = {}) => time > Date.now() - timePastForConnectionErr)
  // return errors.length > 1 && errors.slice(-2)
  //    .every(({ time } = {}) => time > (Date.now() - timePastForConnectionErr))
}

const WalletConnectProvider: React.FC = ({ children }) => {
  const { addToast } = useToast()
  const { selectedAcc } = useAccounts()
  const account = selectedAcc
  const { network, allNetworks, setNetwork }: any = useNetwork()
  const chainId = network?.chainId

  // This is needed cause of the WalletConnect event handlers
  const stateRef: any = useRef()
  stateRef.current = { account, chainId }

  const [state, dispatch]: any = useReducer<any>(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (state: any, action: any) => {
      if (action.type === 'updateConnections') return { ...state, connections: action.connections }
      if (action.type === 'connectedNewSession') {
        return {
          ...state,
          connections: [
            ...state.connections,
            { uri: action.uri, session: action.session, isOffline: false }
          ]
        }
      }
      if (action.type === 'disconnected') {
        return {
          ...state,
          connections: state.connections.filter((x: any) => x.uri !== action.uri)
        }
      }
      if (action.type === 'requestAdded') {
        if (state.requests.find(({ id }: any) => id === action.request.id)) return { ...state }
        return { ...state, requests: [...state.requests, action.request] }
      }
      if (action.type === 'requestsResolved') {
        return {
          ...state,
          requests: state.requests.filter((x: any) => !action.ids.includes(x.id))
        }
      }
      return { ...state }
    },
    null,
    () => {
      // TODO:
      // const json = localStorage[STORAGE_KEY]
      const json = null
      if (!json) return getDefaultState()
      try {
        return {
          ...getDefaultState(),
          ...JSON.parse(json)
        }
      } catch (e) {
        console.error(e)
        return getDefaultState()
      }
    }
  )

  // Side effects that will run on every state change/rerender
  const maybeUpdateSessions = () => {
    // restore connectors and update the ones that are stale
    let updateConnections = false
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state.connections.forEach(({ uri, session, isOffline }: any) => {
      if (connectors[uri]) {
        const connector = connectors[uri]
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const session: any = connector.session
        if (
          session.accounts[0] !== account ||
          session.chainId !== chainId ||
          checkIsOffline(uri) !== isOffline
        ) {
          // NOTE: in case isOffline is different, we do not need to do this, but we're gonna leave that just in case the session is outdated anyway
          connector.updateSession({ accounts: [account], chainId })
          updateConnections = true
        }
      }
    })

    // TODO:
    // localStorage[STORAGE_KEY] = JSON.stringify(state)

    if (updateConnections)
      dispatch({
        type: 'updateConnections',
        connections: state.connections
          .filter(({ uri }: any) => connectors[uri])
          .map(({ uri }: any) => ({
            uri,
            session: connectors[uri].session,
            isOffline: checkIsOffline(uri)
          }))
      })
  }

  useEffect(maybeUpdateSessions, [account, chainId, state])
  // we need this so we can invoke the latest version from any event handler
  stateRef.current.maybeUpdateSessions = maybeUpdateSessions

  // New connections
  const connect = useCallback(
    (connectorOpts) => {
      if (connectors[connectorOpts.uri]) {
        addToast('dApp already connected')
        return connectors[connectorOpts.uri]
      }
      let connector: any
      try {
        // eslint-disable-next-line no-multi-assign
        connector = connectors[connectorOpts.uri] = new WalletConnectCore({
          connectorOpts,
          cryptoLib,
          sessionStorage: noopSessionStorage
        })
      } catch (e) {
        console.error(e)
        addToast(`Unable to connect to ${connectorOpts.uri}: ${e.message}`, { error: true })
        return null
      }

      const onError = (err: any) => {
        addToast(
          `WalletConnect error: ${
            connector.session && connector.session.peerMeta && connector.session.peerMeta.name
          } ${err.message || err}`,
          { error: true }
        )
        console.error('WalletConnect error', err)
      }

      let sessionStart: any
      let sessionTimeout: any
      if (!connector.session.peerMeta)
        sessionTimeout = setTimeout(() => {
          const suggestion = /https:\/\/bridge.walletconnect.org/g.test(connector.session.bridge)
            ? // @TODO: 'or try an alternative connection method' when we implement one
              'this dApp is using an old version of WalletConnect - please tell them to upgrade!'
            : 'perhaps the link has expired? Refresh the dApp and try again.'
          if (!connector.session.peerMeta)
            addToast(`Unable to get session from dApp - ${suggestion}`, { error: true })
        }, SESSION_TIMEOUT)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      connector.on('session_request', (error: any, payload: any) => {
        if (error) {
          onError(error)
          return
        }

        // Clear the "dApp tool too long to connect" timeout
        clearTimeout(sessionTimeout)

        if (connector.session.peerMeta.url.includes('bridge.avax.network')) {
          const message = 'Avalanche Bridge does not currently support smart wallets.'
          connector.rejectSession({ message })
          addToast(message, { error: true })
          return
        }

        // sessionStart is used to check if dApp disconnected immediately
        sessionStart = Date.now()
        connector.approveSession({
          accounts: [stateRef.current.account],
          chainId: stateRef.current.chainId
        })
        // It's safe to read .session right after approveSession because 1) approveSession itself normally stores the session itself
        // 2) connector.session is a getter that re-reads private properties of the connector; those properties are updated immediately at approveSession
        dispatch({
          type: 'connectedNewSession',
          uri: connectorOpts.uri,
          session: connector.session
        })

        addToast(`Successfully connected to ${connector.session.peerMeta.name}`)
      })

      connector.on('transport_error', (error: any, payload: any) => {
        console.error('WalletConnect transport error', payload)
        connectionErrors.push({ uri: connectorOpts.uri, event: payload.event, time: Date.now() })
        // Keep the last 690 only
        connectionErrors = connectionErrors.slice(-690)
        stateRef.current.maybeUpdateSessions()
      })

      connector.on('call_request', (error: any, payload: any) => {
        if (error) {
          onError(error)
          return
        }
        // @TODO: refactor into wcRequestHandler
        // Opensea "unlock currency" hack; they use a stupid MetaTransactions system built into WETH on Polygon
        // There's no point of this because the user has to sign it separately as a tx anyway; but more importantly,
        // it breaks Ambire and other smart wallets cause it relies on ecrecover and does not depend on EIP1271
        if (payload.method === 'eth_signTypedData') {
          // @TODO: try/catch the JSON parse?
          const signPayload = JSON.parse(payload.params[1])
          if (signPayload.primaryType === 'MetaTransaction') {
            // eslint-disable-next-line no-param-reassign
            payload = {
              ...payload,
              method: 'eth_sendTransaction',
              params: [
                {
                  to: signPayload.domain.verifyingContract,
                  from: signPayload.message.from,
                  data: signPayload.message.functionSignature, // @TODO || data?
                  value: signPayload.message.value || '0x0'
                }
              ]
            }
          }
        }
        // FutureProof? WC does not implement it yet
        if (payload.method === 'wallet_switchEthereumChain') {
          const supportedNetwork = allNetworks.find(
            (a: any) => a.chainId === parseInt(payload.params[0].chainId, 16)
          )

          if (supportedNetwork) {
            setNetwork(supportedNetwork.chainId)
            connector.approveRequest({
              id: payload.id,
              result: { chainId: supportedNetwork.chainId }
            })
          } else {
            // Graceful error for user
            addToast(
              `dApp asked to switch to an unsupported chain: ${payload.params[0]?.chainId}`,
              { error: true }
            )
            connector.rejectRequest({ id: payload.id, error: { message: 'Unsupported chain' } })
          }
          return
        }
        if (!SUPPORTED_METHODS.includes(payload.method)) {
          const isUniIgnorable =
            payload.method === 'eth_signTypedData_v4' &&
            connector.session.peerMeta &&
            connector.session.peerMeta.name.includes('Uniswap')
          // @TODO: if the dapp is in a "allow list" of dApps that have fallbacks, ignore certain messages
          // eg uni has a fallback for eth_signTypedData_v4
          if (!isUniIgnorable)
            addToast(`dApp requested unsupported method: ${payload.method}`, { error: true })
          connector.rejectRequest({
            id: payload.id,
            error: { message: `METHOD_NOT_SUPPORTED: ${payload.method}` }
          })
          return
        }
        const wrongAcc =
          (payload.method === 'eth_sendTransaction' &&
            payload.params[0] &&
            payload.params[0].from &&
            payload.params[0].from.toLowerCase() !== connector.session.accounts[0].toLowerCase()) ||
          (payload.method === 'eth_sign' &&
            payload.params[1] &&
            payload.params[1].toLowerCase() !== connector.session.accounts[0].toLowerCase())
        if (wrongAcc) {
          addToast(`dApp sent a request for the wrong account: ${payload.params[0].from}`, {
            error: true
          })
          connector.rejectRequest({
            id: payload.id,
            error: { message: 'Sent a request for the wrong account' }
          })
          return
        }
        dispatch({
          type: 'requestAdded',
          request: {
            id: payload.id,
            type: payload.method,
            wcUri: connectorOpts.uri,
            txn: payload.method === 'eth_sign' ? payload.params[1] : payload.params[0],
            chainId: connector.session.chainId,
            account: connector.session.accounts[0],
            notification: true
          }
        })
      })

      connector.on('disconnect', (error: any, payload: any) => {
        if (error) {
          onError(error)
          return
        }

        clearTimeout(sessionTimeout)
        // NOTE the dispatch() will cause double rerender when we trigger a disconnect,
        // cause we will call it once on disconnect() and once when the event arrives
        // we can prevent this by checking if (!connectors[...]) but we'd rather stay safe and ensure
        // the connection is removed
        dispatch({ type: 'disconnected', uri: connectorOpts.uri })
        connectors[connectorOpts.uri] = null

        // NOTE: this event might be invoked 2 times when the dApp itself disconnects
        // currently we don't dedupe that
        if (sessionStart && Date.now() - sessionStart < SESSION_TIMEOUT) {
          addToast(
            'dApp disconnected immediately - perhaps it does not support the current network?',
            { error: true }
          )
        } else {
          addToast(`${connector.session.peerMeta.name} disconnected: ${payload.params[0].message}`)
        }
      })

      connector.on('error', onError)

      return connector
    },
    [addToast, allNetworks, setNetwork]
  )

  const disconnect = useCallback((uri) => {
    // connector might not be there, either cause we disconnected before,
    // or cause we failed to connect in the first place
    if (connectors[uri]) {
      connectors[uri].killSession()
      connectors[uri] = null
    }
    dispatch({ type: 'disconnected', uri })
  }, [])

  const resolveMany = (ids: any, resolution: any) => {
    state.requests.forEach(({ id, wcUri }: any) => {
      if (ids.includes(id)) {
        const connector = connectors[wcUri]
        if (!connector) return
        if (resolution.success) connector.approveRequest({ id, result: resolution.result })
        else connector.rejectRequest({ id, error: { message: resolution.message } })
      }
    })
    dispatch({ type: 'requestsResolved', ids })
  }

  // Side effects on init
  useEffect(() => {
    state.connections.forEach(({ uri, session }: any) => {
      if (!connectors[uri]) connect({ uri, session })
    })
    // we specifically want to run this only once despite depending on state
  }, [connect])

  const handleConnect = (uri: string) => {
    connect({ uri })
  }

  return (
    <WalletConnectContext.Provider
      value={useMemo(
        () => ({
          connections: state.connections,
          requests: state.requests,
          resolveMany,
          connect,
          disconnect,
          handleConnect
        }),
        [state]
      )}
    >
      {children}
    </WalletConnectContext.Provider>
  )
}

export { WalletConnectContext, WalletConnectProvider }
