// So that the localization gets initialized at the beginning.
import '@config/localization'

import { StatusBar } from 'expo-status-bar'
import React from 'react'

import Router from '@config/Router'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import Toast from '@modules/common/components/Toast'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'
import { AddressBookProvider } from '@modules/common/contexts/addressBookContext'
import { NetworkProvider } from '@modules/common/contexts/networkContext'
import { PortfolioProvider } from '@modules/common/contexts/portfolioContext'
import { RequestsProvider } from '@modules/common/contexts/requestsContext'

const App = () => {
  return (
    <>
      <StatusBar style="auto" />
      <AuthProvider>
        <AccountsProvider>
          <NetworkProvider>
            <PortfolioProvider>
              <RequestsProvider>
                <AddressBookProvider>
                  <PortalProvider>
                    <>
                      <Router />
                      <Toast />
                    </>
                    <PortalHost name="global" />
                  </PortalProvider>
                </AddressBookProvider>
              </RequestsProvider>
            </PortfolioProvider>
          </NetworkProvider>
        </AccountsProvider>
      </AuthProvider>
    </>
  )
}

export default App
