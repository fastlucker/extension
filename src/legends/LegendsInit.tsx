import React from 'react'

import { PortalHost, PortalProvider } from '@gorhom/portal'
import { EthereumProvider } from '@web/extension-services/inpage/EthereumProvider'

import { AccountContextProvider } from './contexts/accountContext'
import { PortfolioControllerStateProvider } from './contexts/portfolioControllerStateContext'
import Router from './modules/router/Router'

declare global {
  interface Window {
    ambire: EthereumProvider
  }
}

const LegendsInit = () => {
  return (
    <PortalProvider>
      <AccountContextProvider>
        <PortfolioControllerStateProvider>
          <Router />
        </PortfolioControllerStateProvider>
      </AccountContextProvider>
      <PortalHost name="global" />
    </PortalProvider>
  )
}

export default LegendsInit
