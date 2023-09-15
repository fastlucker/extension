// @ts-nocheck TODO: fix provider types

import { areRpcProvidersInitialized, initRpcProviders } from 'ambire-common/src/services/provider'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { BannerProvider } from '@common/contexts/bannerContext/bannerContext'
import { BiometricsProvider } from '@common/contexts/biometricsContext'
import { ConstantsProvider } from '@common/contexts/constantsContext'
import { KeyboardProvider } from '@common/contexts/keyboardContext'
import { LoaderProvider } from '@common/contexts/loaderContext'
import { NetInfoProvider } from '@common/contexts/netInfoContext'
import { PrivateModeProvider } from '@common/contexts/privateModeContext'
import { StorageProvider } from '@common/contexts/storageContext'
import { ThemeProvider } from '@common/contexts/themeContext'
import { ToastProvider } from '@common/contexts/toastContext'
import useFonts from '@common/hooks/useFonts'
import AppRouter from '@common/modules/app-init/components/AppRouter'
import { AuthProvider } from '@common/modules/auth/contexts/authContext'
import { rpcProviders } from '@common/services/providers'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { isExtension } from '@web/constants/browserapi'
import { AccountAdderControllerStateProvider } from '@web/contexts/accountAdderControllerStateContext'
import { ActivityControllerStateProvider } from '@web/contexts/activityControllerStateContext'
import { BackgroundServiceProvider } from '@web/contexts/backgroundServiceContext'
import { ControllersStateLoadedProvider } from '@web/contexts/controllersStateLoadedContext'
import { ExtensionProvider } from '@web/contexts/extensionContext'
import { IdentityInfoProvider } from '@web/contexts/identityInfoContext'
import { KeystoreControllerStateProvider } from '@web/contexts/keystoreControllerStateContext'
import { MainControllerStateProvider } from '@web/contexts/mainControllerStateContext'
import { NotificationControllerStateProvider } from '@web/contexts/notificationControllerStateContext'
import { PortfolioControllerStateProvider } from '@web/contexts/portfolioControllerStateContext'
import { SignMessageControllerStateProvider } from '@web/contexts/signMessageControllerStateContext'
import { OnboardingProvider } from '@web/modules/onboarding/contexts/onboardingContext'

// Initialize rpc providers for all networks
const shouldInitProviders = !areRpcProvidersInitialized()
if (shouldInitProviders) {
  initRpcProviders(rpcProviders)
}

const Router = isExtension ? HashRouter : BrowserRouter

const AppInit = () => {
  const { fontsLoaded } = useFonts()

  if (!fontsLoaded) return null

  return (
    <BackgroundServiceProvider>
      <Router>
        <MainControllerStateProvider>
          <AccountAdderControllerStateProvider>
            <KeystoreControllerStateProvider>
              <SignMessageControllerStateProvider>
                <ActivityControllerStateProvider>
                  <NotificationControllerStateProvider>
                    <IdentityInfoProvider>
                      <PortfolioControllerStateProvider>
                        <ControllersStateLoadedProvider>
                          <PortalProvider>
                            <LoaderProvider>
                              <StorageProvider>
                                <OnboardingProvider>
                                  <ThemeProvider>
                                    <SafeAreaProvider>
                                      <KeyboardProvider>
                                        <NetInfoProvider>
                                          <BannerProvider>
                                            <ToastProvider>
                                              <ConstantsProvider>
                                                <AuthProvider>
                                                  <ExtensionProvider>
                                                    <BiometricsProvider>
                                                      <PrivateModeProvider>
                                                        <AppRouter />
                                                      </PrivateModeProvider>
                                                      <PortalHost name="global" />
                                                    </BiometricsProvider>
                                                  </ExtensionProvider>
                                                </AuthProvider>
                                              </ConstantsProvider>
                                            </ToastProvider>
                                          </BannerProvider>
                                        </NetInfoProvider>
                                      </KeyboardProvider>
                                    </SafeAreaProvider>
                                  </ThemeProvider>
                                </OnboardingProvider>
                              </StorageProvider>
                            </LoaderProvider>
                          </PortalProvider>
                        </ControllersStateLoadedProvider>
                      </PortfolioControllerStateProvider>
                    </IdentityInfoProvider>
                  </NotificationControllerStateProvider>
                </ActivityControllerStateProvider>
              </SignMessageControllerStateProvider>
            </KeystoreControllerStateProvider>
          </AccountAdderControllerStateProvider>
        </MainControllerStateProvider>
      </Router>
    </BackgroundServiceProvider>
  )
}

export default AppInit
