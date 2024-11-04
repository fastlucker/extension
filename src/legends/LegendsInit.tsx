import React from 'react'
import ErrorBoundary from 'react-native-error-boundary'

import { PortalHost, PortalProvider } from '@gorhom/portal'
import { EthereumProvider } from '@web/extension-services/inpage/EthereumProvider'

import { DomainsContextProvider } from '../common/contexts/domainsContext'
import ErrorPage from './components/ErrorPage'
import { AccountContextProvider } from './contexts/accountContext'
import { ActivityContextProvider } from './contexts/activityContext'
import { CharacterContextProvider } from './contexts/characterContext'
import { LeaderboardContextProvider } from './contexts/leaderboardContext'
import { LegendsContextProvider } from './contexts/legendsContext'
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
              <LegendsContextProvider>
                <LeaderboardContextProvider>
                  <ActivityContextProvider>
                    <PortfolioControllerStateProvider>
                      <DomainsContextProvider>
                        <Router />
                      </DomainsContextProvider>
                    </PortfolioControllerStateProvider>
                  </ActivityContextProvider>
                </LeaderboardContextProvider>
              </LegendsContextProvider>
            </CharacterContextProvider>
          </AccountContextProvider>
        </ToastContextProvider>
        <PortalHost name="global" />
      </PortalProvider>
    </ErrorBoundary>
  )
}

export default LegendsInit
