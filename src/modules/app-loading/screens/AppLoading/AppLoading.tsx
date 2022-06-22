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
import { HeaderBottomSheetProvider } from '@modules/common/contexts/headerBottomSheetContext'
import { KeyboardProvider } from '@modules/common/contexts/keyboardContext'
import { LinkingProvider } from '@modules/common/contexts/linkingContext'
import { LoaderProvider } from '@modules/common/contexts/loaderContext'
import { NetInfoProvider } from '@modules/common/contexts/netInfoContext'
import { NetworkProvider } from '@modules/common/contexts/networkContext'
import { PasscodeProvider } from '@modules/common/contexts/passcodeContext'
import { PortfolioProvider } from '@modules/common/contexts/portfolioContext'
import { PrivateModeProvider } from '@modules/common/contexts/privateModeContext'
import { RequestsProvider } from '@modules/common/contexts/requestsContext'
import { StorageContext } from '@modules/common/contexts/storageContext'
import { ThemeProvider } from '@modules/common/contexts/themeContext'
import { ToastProvider } from '@modules/common/contexts/toastContext'
import { UnsupportedDAppsBottomSheetProvider } from '@modules/common/contexts/unsupportedDAppsBottomSheetContext'
import { WalletConnectProvider } from '@modules/common/contexts/walletConnectContext'
import useFonts from '@modules/common/hooks/useFonts'

const AppLoading = () => {
  const { storageLoaded } = useContext(StorageContext)
  const { fontsLoaded } = useFonts()

  if (!storageLoaded || !fontsLoaded) return null

  return (
    <LoaderProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <KeyboardProvider>
            <NetInfoProvider>
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
                                        <PrivateModeProvider>
                                          <UnsupportedDAppsBottomSheetProvider>
                                            <HeaderBottomSheetProvider>
                                              <LinkingProvider>
                                                <Router />
                                              </LinkingProvider>
                                            </HeaderBottomSheetProvider>
                                          </UnsupportedDAppsBottomSheetProvider>
                                        </PrivateModeProvider>
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
            </NetInfoProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </LoaderProvider>
  )
}

export default AppLoading
