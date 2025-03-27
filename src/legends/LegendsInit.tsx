import React from 'react'
import ErrorBoundary from 'react-native-error-boundary'

import { SENTRY_DSN_LEGENDS } from '@env'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import * as Sentry from '@sentry/react-native'
import { EthereumProvider } from '@web/extension-services/inpage/EthereumProvider'

import ErrorPage from './components/ErrorPage'
import { AccountContextProvider } from './contexts/accountContext'
import { CharacterContextProvider } from './contexts/characterContext'
import { ToastContextProvider } from './contexts/toastsContext'
import Router from './modules/router/Router'

declare global {
  interface Window {
    ambire: EthereumProvider
  }
}

Sentry.init({
  dsn: SENTRY_DSN_LEGENDS,
  release: 'legends@1.0.0',
  sendDefaultPii: true
})

const LegendsInit = () => {
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorPage />}>
      <PortalProvider>
        <ToastContextProvider>
          <AccountContextProvider>
            <CharacterContextProvider>
              <Router />
            </CharacterContextProvider>
          </AccountContextProvider>
        </ToastContextProvider>
        <PortalHost name="global" />
      </PortalProvider>
    </ErrorBoundary>
  )
}

export default Sentry.wrap(LegendsInit)
