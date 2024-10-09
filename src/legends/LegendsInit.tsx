import React from 'react'

import { PortalHost, PortalProvider } from '@gorhom/portal'
import { EthereumProvider } from '@web/extension-services/inpage/EthereumProvider'

import { AccountContextProvider } from './contexts/accountContext'
import { CharacterContextProvider } from './contexts/characterContext'
import { PortfolioControllerStateProvider } from './contexts/portfolioControllerStateContext'
import { ToastContextProvider } from './contexts/toastsContext'
import Router from './modules/router/Router'

declare global {
  interface Window {
    ambire: EthereumProvider
  }
}

const LegendsInit = () => {
  return (
    <PortalProvider>
      <ToastContextProvider>
        <AccountContextProvider>
          <CharacterContextProvider>
            <PortfolioControllerStateProvider>
              <Router />
            </PortfolioControllerStateProvider>
          </CharacterContextProvider>
        </AccountContextProvider>
      </ToastContextProvider>
      <PortalHost name="global" />
    </PortalProvider>
  )
}

export default LegendsInit
