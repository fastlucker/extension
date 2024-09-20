import React from 'react'
import { BrowserRouter } from 'react-router-dom'

// import { PortalHost, PortalProvider } from '@gorhom/portal'
import Router from './modules/router/Router'

const BenzinInit = () => {
  return (
    <BrowserRouter>
      {/* <PortalProvider> */}
      <Router />
      {/* <PortalHost name="global" /> */}
      {/* </PortalProvider> */}
    </BrowserRouter>
  )
}

export default BenzinInit
