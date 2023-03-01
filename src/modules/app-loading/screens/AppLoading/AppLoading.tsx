import { areRpcProvidersInitialized, initRpcProviders } from 'ambire-common/src/services/provider'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

import { isWeb } from '@config/env'
import AppRouter from '@config/Router'
import { navigationContainerDarkTheme } from '@config/Router/styles'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import AttentionGrabberProvider from '@modules/common/components/AttentionGrabber'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'
import { AddressBookProvider } from '@modules/common/contexts/addressBookContext'
import { AmbireExtensionProvider } from '@modules/common/contexts/ambireExtensionContext'
import { BiometricsProvider } from '@modules/common/contexts/biometricsContext'
import { ConstantsProvider } from '@modules/common/contexts/constantsContext'
import { ExtensionApprovalProvider } from '@modules/common/contexts/extensionApprovalContext'
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
import { navigationRef, routeNameRef } from '@modules/common/services/navigation'
import { rpcProviders } from '@modules/common/services/providers'
import { VaultProvider } from '@modules/vault/contexts/vaultContext'
import { NavigationContainer } from '@react-navigation/native'
import { isExtension } from '@web/constants/browserapi'

// Initialize rpc providers for all networks
const shouldInitProviders = !areRpcProvidersInitialized()
if (shouldInitProviders) {
  initRpcProviders(rpcProviders)
}

const handleOnReady = () => {
  // @ts-ignore for some reason TS complains about this 👇
  routeNameRef.current = navigationRef.current.getCurrentRoute()?.name
}

const Router = isExtension
  ? MemoryRouter
  : isWeb
  ? BrowserRouter
  : ({ children }) => (
      <NavigationContainer
        // Part of the mechanism for being able to navigate without the navigation prop.
        // For more details, see the NavigationService.
        ref={navigationRef}
        onReady={handleOnReady}
        theme={navigationContainerDarkTheme}
      >
        {children}
      </NavigationContainer>
    )

const AppLoading = () => {
  const { fontsLoaded } = useFonts()

  if (!fontsLoaded) return null

  return (
    <Router>
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
                              <ExtensionApprovalProvider>
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
                                                            <AppRouter />
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
                              </ExtensionApprovalProvider>
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
    </Router>
  )
}

export default AppLoading
