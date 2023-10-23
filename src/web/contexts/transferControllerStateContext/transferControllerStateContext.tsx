import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import useConstants from '@common/hooks/useConstants'
import useRoute from '@common/hooks/useRoute'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

type ContextReturn = {
  state: TransferControllerState
  initializeController: () => void
}

const TransferControllerStateContext = createContext<ContextReturn>({} as ContextReturn)

const getInfoFromSearch = (search: string | undefined) => {
  if (!search || !search?.includes('networkId') || !search?.includes('address')) return null

  const params = new URLSearchParams(search)

  return `${params.get('address')}-${params.get('networkId')}`
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

  const preSelectedToken = useMemo(() => {
    if (!selectedTokenFromUrl && tokens && tokens?.length > 0)
      return `${tokens[0].address}-${tokens[0].networkId}`
    if (!selectedTokenFromUrl && !tokens) return null

    return selectedTokenFromUrl
  }, [selectedTokenFromUrl, tokens])

  const initializeController = useCallback(async () => {
    if (
      !constants ||
      !mainState.selectedAccount ||
      !tokens ||
      !mainState.isReady ||
      state?.isInitialized
    )
      return

    await dispatch({
      type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
      params: {
        selectedAccount: mainState.selectedAccount,
        tokens,
        humanizerInfo: constants.humanizerInfo,
        preSelectedToken: preSelectedToken || undefined
      }
    })
  }, [
    constants,
    dispatch,
    mainState.isReady,
    mainState.selectedAccount,
    preSelectedToken,
    tokens,
    state?.isInitialized
  ])

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
    <TransferControllerStateContext.Provider
      value={useMemo(() => ({ state, initializeController }), [state, initializeController])}
    >
      {children}
    </TransferControllerStateContext.Provider>
  )
}

export { TransferControllerStateProvider, TransferControllerStateContext }
