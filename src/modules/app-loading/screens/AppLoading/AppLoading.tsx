import { areRpcProvidersInitialized, initRpcProviders } from 'ambire-common/src/services/provider'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Router from '@config/Router'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import AttentionGrabberProvider from '@modules/common/components/AttentionGrabber'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'
import { AddressBookProvider } from '@modules/common/contexts/addressBookContext'
import { AmbireExtensionProvider } from '@modules/common/contexts/ambireExtensionContext'
import { BiometricsProvider } from '@modules/common/contexts/biometricsContext'
import { ConstantsProvider } from '@modules/common/contexts/constantsContext'
import { GasTankProvider } from '@modules/common/contexts/gasTankContext'
import { GnosisProvider } from '@modules/common/contexts/gnosisContext'
import { HeaderBottomSheetProvider } from '@modules/common/contexts/headerBottomSheetContext'
import { KeyboardProvider } from '@modules/common/contexts/keyboardContext'
import { LinkingProvider } from '@modules/common/contexts/linkingContext'
import { LoaderProvider } from '@modules/common/contexts/loaderContext'
import { NetInfoProvider } from '@modules/common/contexts/netInfoContext'
import { NetworkProvider } from '@modules/common/contexts/networkContext'
import { PortfolioProvider } from '@modules/common/contexts/portfolioContext'
import { PrivateModeProvider } from '@modules/common/contexts/privateModeContext'
import { RequestsProvider } from '@modules/common/contexts/requestsContext'
import { StorageProvider } from '@modules/common/contexts/storageContext'
import { ThemeProvider } from '@modules/common/contexts/themeContext'
import { ToastProvider } from '@modules/common/contexts/toastContext'
import { UnsupportedDAppsBottomSheetProvider } from '@modules/common/contexts/unsupportedDAppsBottomSheetContext'
import { WalletConnectProvider } from '@modules/common/contexts/walletConnectContext'
import useFonts from '@modules/common/hooks/useFonts'
import { rpcProviders } from '@modules/common/services/providers'
import { VaultProvider } from '@modules/vault/contexts/vaultContext'

// Initialize rpc providers for all networks
const shouldInitProviders = !areRpcProvidersInitialized()
if (shouldInitProviders) {
  initRpcProviders(rpcProviders)
}

const AppLoading = () => {
  const { fontsLoaded } = useFonts()

  if (!fontsLoaded) return null

  return (
    <PortalProvider>
      <LoaderProvider>
        <StorageProvider>
          <ThemeProvider>
            <SafeAreaProvider>
              <KeyboardProvider>
                <NetInfoProvider>
                  <ToastProvider>
                    <ConstantsProvider>
                      <AuthProvider>
                        <AccountsProvider>
                          <NetworkProvider>
                            <PortfolioProvider>
                              <GnosisProvider>
                                <WalletConnectProvider>
                                  <AmbireExtensionProvider>
                                    <RequestsProvider>
                                      <BiometricsProvider>
                                        <VaultProvider>
                                          <AddressBookProvider>
                                            <AttentionGrabberProvider>
                                              <PrivateModeProvider>
                                                <GasTankProvider>
                                                  <UnsupportedDAppsBottomSheetProvider>
                                                    <HeaderBottomSheetProvider>
                                                      <LinkingProvider>
                                                        <Router />
                                                      </LinkingProvider>
                                                    </HeaderBottomSheetProvider>
                                                  </UnsupportedDAppsBottomSheetProvider>
                                                </GasTankProvider>
                                              </PrivateModeProvider>
                                            </AttentionGrabberProvider>
                                            <PortalHost name="global" />
                                          </AddressBookProvider>
                                        </VaultProvider>
                                      </BiometricsProvider>
                                    </RequestsProvider>
                                  </AmbireExtensionProvider>
                                </WalletConnectProvider>
                              </GnosisProvider>
                            </PortfolioProvider>
                          </NetworkProvider>
                        </AccountsProvider>
                      </AuthProvider>
                    </ConstantsProvider>
                  </ToastProvider>
                </NetInfoProvider>
              </KeyboardProvider>
            </SafeAreaProvider>
          </ThemeProvider>
        </StorageProvider>
      </LoaderProvider>
    </PortalProvider>
  )
}

export default AppLoading
