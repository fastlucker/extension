import React, { useContext } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Router from '@config/Router'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import AttentionGrabberProvider from '@modules/common/components/AttentionGrabber'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'
import { AccountsPasswordsProvider } from '@modules/common/contexts/accountsPasswordsContext'
import { AddressBookProvider } from '@modules/common/contexts/addressBookContext'
import { GnosisProvider } from '@modules/common/contexts/gnosisContext'
import { NetworkProvider } from '@modules/common/contexts/networkContext'
import { PasscodeProvider } from '@modules/common/contexts/passcodeContext'
import { PortfolioProvider } from '@modules/common/contexts/portfolioContext'
import { RequestsProvider } from '@modules/common/contexts/requestsContext'
import { StorageContext } from '@modules/common/contexts/storageContext'
import { ToastProvider } from '@modules/common/contexts/toastContext'
import { WalletConnectProvider } from '@modules/common/contexts/walletConnectContext'

const AppLoading = () => {
  const { storageLoaded } = useContext(StorageContext)
  if (!storageLoaded) return null

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <AccountsProvider>
            <NetworkProvider>
              <PortfolioProvider>
                <GnosisProvider>
                  <WalletConnectProvider>
                    <RequestsProvider>
                      <AddressBookProvider>
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
                      </AddressBookProvider>
                    </RequestsProvider>
                  </WalletConnectProvider>
                </GnosisProvider>
              </PortfolioProvider>
            </NetworkProvider>
          </AccountsProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  )
}

export default AppLoading
