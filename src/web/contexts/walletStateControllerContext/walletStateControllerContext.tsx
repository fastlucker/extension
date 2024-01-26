/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { WalletStateController } from '@web/extension-services/background/controllers/wallet-state'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const WalletStateControllerContext = createContext<WalletStateController>(
  {} as WalletStateController
)

const WalletStateControllerProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as WalletStateController)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'walletState' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = (newState: WalletStateController) => {
      setState(newState)
    }

    eventBus.addEventListener('walletState', onUpdate)

    return () => eventBus.removeEventListener('walletState', onUpdate)
  }, [])

  return (
    <WalletStateControllerContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </WalletStateControllerContext.Provider>
  )
}

export { WalletStateControllerProvider, WalletStateControllerContext }
