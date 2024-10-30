import React from 'react'

import { PortalHost, PortalProvider } from '@gorhom/portal'
import { EthereumProvider } from '@web/extension-services/inpage/EthereumProvider'
import ErrorBoundary from 'react-native-error-boundary'

import ErrorPage from './components/ErrorPage'
import { DomainsContextProvider } from '../common/contexts/domainsContext'
import { AccountContextProvider } from './contexts/accountContext'
import { ActivityContextProvider } from './contexts/activityContext'
import { CharacterContextProvider } from './contexts/characterContext'
import { LeaderboardContextProvider } from './contexts/leaderboardContext'
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
    <ErrorBoundary FallbackComponent={() => <ErrorPage />}>
      <PortalProvider>
        <ToastContextProvider>
          <AccountContextProvider>
            <CharacterContextProvider>
              <LeaderboardContextProvider>
                <ActivityContextProvider>
                  <PortfolioControllerStateProvider>
                    <DomainsContextProvider>
                      <Router />
                    </DomainsContextProvider>
                  </PortfolioControllerStateProvider>
                </ActivityContextProvider>
              </LeaderboardContextProvider>
            </CharacterContextProvider>
          </AccountContextProvider>
        </ToastContextProvider>
        <PortalHost name="global" />
      </PortalProvider>
    </ErrorBoundary>
  )
}

export default LegendsInit
