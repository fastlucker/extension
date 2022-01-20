// So that the localization gets initialized at the beginning.
import '@config/localization'

import { StatusBar } from 'expo-status-bar'
import React from 'react'

import Router from '@config/Router'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import AttentionGrabberProvider from '@modules/common/components/AttentionGrabber'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'
import { AddressBookProvider } from '@modules/common/contexts/addressBookContext'
import { NetworkProvider } from '@modules/common/contexts/networkContext'
import { PortfolioProvider } from '@modules/common/contexts/portfolioContext'
import { RelayerDataProvider } from '@modules/common/contexts/relayerDataContext'
import { RequestsProvider } from '@modules/common/contexts/requestsContext'
import { ToastProvider } from '@modules/common/contexts/toastContext'

const App = () => {
  return (
    <>
      <StatusBar style="light" />
      <ToastProvider>
        <AuthProvider>
          <AccountsProvider>
            <NetworkProvider>
              <PortfolioProvider>
                <RequestsProvider>
                  <AddressBookProvider>
                    <RelayerDataProvider>
                      <PortalProvider>
                        <AttentionGrabberProvider>
                          <Router />
                        </AttentionGrabberProvider>
                        <PortalHost name="global" />
                      </PortalProvider>
                    </RelayerDataProvider>
                  </AddressBookProvider>
                </RequestsProvider>
              </PortfolioProvider>
            </NetworkProvider>
          </AccountsProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  )
}

export default App
