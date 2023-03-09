import { areRpcProvidersInitialized, initRpcProviders } from 'ambire-common/src/services/provider'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import AttentionGrabberProvider from '@common/components/AttentionGrabber'
import { AccountsProvider } from '@common/contexts/accountsContext'
import { AddressBookProvider } from '@common/contexts/addressBookContext'
import { AmbireExtensionProvider } from '@common/contexts/ambireExtensionContext'
import { BiometricsProvider } from '@common/contexts/biometricsContext'
import { ConstantsProvider } from '@common/contexts/constantsContext'
import { ExtensionApprovalProvider } from '@common/contexts/extensionApprovalContext'
import { GasTankProvider } from '@common/contexts/gasTankContext'
import { GnosisProvider } from '@common/contexts/gnosisContext'
import { HeaderBottomSheetProvider } from '@common/contexts/headerBottomSheetContext'
import { KeyboardProvider } from '@common/contexts/keyboardContext'
import { LinkingProvider } from '@common/contexts/linkingContext'
import { LoaderProvider } from '@common/contexts/loaderContext'
import { NetInfoProvider } from '@common/contexts/netInfoContext'
import { NetworkProvider } from '@common/contexts/networkContext'
import { PortfolioProvider } from '@common/contexts/portfolioContext'
import { PrivateModeProvider } from '@common/contexts/privateModeContext'
import { RequestsProvider } from '@common/contexts/requestsContext'
import { StorageProvider } from '@common/contexts/storageContext'
import { ThemeProvider } from '@common/contexts/themeContext'
import { ToastProvider } from '@common/contexts/toastContext'
import { UnsupportedDAppsBottomSheetProvider } from '@common/contexts/unsupportedDAppsBottomSheetContext'
import { WalletConnectProvider } from '@common/contexts/walletConnectContext'
import useFonts from '@common/hooks/useFonts'
import { navigationRef, routeNameRef } from '@common/services/navigation'
import { rpcProviders } from '@common/services/providers'
import { isWeb } from '@config/env'
import AppRouter from '@config/Router'
import { navigationContainerDarkTheme } from '@config/Router/styles'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '@mobile/auth/contexts/authContext'
import { OnboardingProvider } from '@mobile/onboarding/contexts/onboardingContext'
import { VaultProvider } from '@mobile/vault/contexts/vaultContext'
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
  ? HashRouter
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
            <OnboardingProvider>
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
            </OnboardingProvider>
          </StorageProvider>
        </LoaderProvider>
      </PortalProvider>
    </Router>
  )
}

export default AppLoading
