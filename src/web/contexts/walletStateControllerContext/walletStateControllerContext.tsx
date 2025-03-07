/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect } from 'react'

import useDeepMemo from '@common/hooks/useDeepMemo'
import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const WalletStateControllerContext = createContext<WalletStateController>(
  {} as WalletStateController
)

const WalletStateControllerProvider: React.FC<any> = ({ children }) => {
  const controller = 'walletState'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const { isDefaultWallet, isReady } = state

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  // checks if the wallet is the default wallet and sets it if it's not
  useEffect(() => {
    if (state && isReady && (isDefaultWallet === undefined || !isDefaultWallet)) {
      dispatch({
        type: 'SET_IS_DEFAULT_WALLET',
        params: { isDefaultWallet: true }
      })
    }
  }, [dispatch, isDefaultWallet, isReady, state])

  const memoizedState = useDeepMemo(state, controller)

  return (
    <WalletStateControllerContext.Provider value={memoizedState}>
      {children}
    </WalletStateControllerContext.Provider>
  )
}

export { WalletStateControllerProvider, WalletStateControllerContext }
