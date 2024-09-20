import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { PortalHost, PortalProvider } from '@gorhom/portal'
import { EthereumProvider } from '@web/extension-services/inpage/EthereumProvider'

import Router from './modules/router/Router'

declare global {
  interface Window {
    ambire: EthereumProvider
  }
}

const LegendsInit = () => {
  return (
    <BrowserRouter>
      <PortalProvider>
        <Router />
        <PortalHost name="global" />
      </PortalProvider>
    </BrowserRouter>
  )
}

export default LegendsInit
