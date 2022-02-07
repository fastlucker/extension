// So that the localization gets initialized at the beginning.
import '@config/localization'

import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import Router from '@config/Router'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import AttentionGrabberProvider from '@modules/common/components/AttentionGrabber'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'
import { AccountsPasswordsProvider } from '@modules/common/contexts/accountsPasswordsContext'
import { AddressBookProvider } from '@modules/common/contexts/addressBookContext'
import { NetworkProvider } from '@modules/common/contexts/networkContext'
import { PasscodeProvider } from '@modules/common/contexts/passcodeContext'
import { PortfolioProvider } from '@modules/common/contexts/portfolioContext'
import { RequestsProvider } from '@modules/common/contexts/requestsContext'
import { ToastProvider } from '@modules/common/contexts/toastContext'
import { WalletConnectProvider } from '@modules/common/contexts/walletConnectContext'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

SplashScreen.preventAutoHideAsync().catch(console.warn) // TODO: log a sentry error

const App = () => {
  return (
    <GestureHandlerRootView style={flexboxStyles.flex1}>
      <StatusBar style="light" />

      <ToastProvider>
        <AuthProvider>
          <AccountsProvider>
            <NetworkProvider>
              <PortfolioProvider>
                <RequestsProvider>
                  <AddressBookProvider>
                    <WalletConnectProvider>
                      <AccountsPasswordsProvider>
                        <PortalProvider>
                          <PasscodeProvider>
                            <AttentionGrabberProvider>
                              <Router />
                            </AttentionGrabberProvider>
                            <PortalHost name="global" />
                          </PasscodeProvider>
                        </PortalProvider>
                      </AccountsPasswordsProvider>
                    </WalletConnectProvider>
                  </AddressBookProvider>
                </RequestsProvider>
              </PortfolioProvider>
            </NetworkProvider>
          </AccountsProvider>
        </AuthProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  )
}

export default App
