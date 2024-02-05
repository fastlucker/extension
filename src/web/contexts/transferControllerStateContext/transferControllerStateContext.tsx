import React, { createContext, useEffect, useMemo, useState } from 'react'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import useConstants from '@common/hooks/useConstants'
import useRoute from '@common/hooks/useRoute'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

type ContextReturn = {
  state: TransferControllerState
}

const TransferControllerStateContext = createContext<ContextReturn>({} as ContextReturn)

const getInfoFromSearch = (search: string | undefined) => {
  if (!search || !search?.includes('networkId') || !search?.includes('address')) return null

  const params = new URLSearchParams(search)

  return {
    addr: params.get('address'),
    networkId: params.get('networkId'),
    isTopUp: typeof params.get('isTopUp') === 'string'
  }
}

const TransferControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as TransferControllerState)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()
  const { constants } = useConstants()
  const { accountPortfolio } = usePortfolioControllerState()
  const { search } = useRoute()
  const tokens = accountPortfolio?.tokens
  const selectedTokenFromUrl = useMemo(() => getInfoFromSearch(search), [search])

  useEffect(() => {
    return () => {
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_RESET_FORM'
      })
    }
  }, [dispatch])

  useEffect(() => {
    if (!constants) return
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: {
        humanizerInfo: constants.humanizerInfo
      }
    })
  }, [constants, dispatch])

  useEffect(() => {
    if (tokens?.length && selectedTokenFromUrl && !state.selectedToken) {
      const tokenToSelect = tokens.find(
        (t) =>
          t.address === selectedTokenFromUrl.addr &&
          t.networkId === selectedTokenFromUrl.networkId &&
          t.flags.onGasTank === false
      )
      if (tokenToSelect) {
        dispatch({
          type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
          params: { selectedToken: tokenToSelect, isTopUp: selectedTokenFromUrl.isTopUp }
        })
      }
    }
  }, [tokens, selectedTokenFromUrl, state.selectedToken, dispatch])

  useEffect(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: { tokens }
    })
  }, [tokens, dispatch])

  useEffect(() => {
    if (!mainState.selectedAccount) return

    dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: { selectedAccount: mainState.selectedAccount }
    })
  }, [mainState.selectedAccount, dispatch])

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'transfer' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    if (state.userRequest) {
      dispatch({
        type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
        params: state.userRequest
      })
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_RESET_FORM'
      })
    }
  }, [dispatch, state.userRequest])

  useEffect(() => {
    const onUpdate = (newState: TransferControllerState) => {
      setState(newState)
    }

    eventBus.addEventListener('transfer', onUpdate)

    return () => {
      eventBus.removeEventListener('transfer', onUpdate)
    }
  }, [])

  return (
    <TransferControllerStateContext.Provider value={useMemo(() => ({ state }), [state])}>
      {children}
    </TransferControllerStateContext.Provider>
  )
}

export { TransferControllerStateProvider, TransferControllerStateContext }
