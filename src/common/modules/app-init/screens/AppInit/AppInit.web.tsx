// @ts-nocheck TODO: fix provider types

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter, HashRouter } from 'react-router-dom'

// TODO: v2
// import AttentionGrabberProvider from '@common/components/AttentionGrabber'
import { AmbireExtensionProvider } from '@common/contexts/ambireExtensionContext'
import { BiometricsProvider } from '@common/contexts/biometricsContext'
import { ConstantsProvider } from '@common/contexts/constantsContext'
import { KeyboardProvider } from '@common/contexts/keyboardContext'
import { LinkingProvider } from '@common/contexts/linkingContext'
import { LoaderProvider } from '@common/contexts/loaderContext'
import { NetInfoProvider } from '@common/contexts/netInfoContext'
import { PrivateModeProvider } from '@common/contexts/privateModeContext'
import { StorageProvider } from '@common/contexts/storageContext'
import { ThemeProvider } from '@common/contexts/themeContext'
import { ToastProvider } from '@common/contexts/toastContext'
import useFonts from '@common/hooks/useFonts'
import AppRouter from '@common/modules/app-init/components/AppRouter'
import { AuthProvider } from '@common/modules/auth/contexts/authContext'
import { areRpcProvidersInitialized, initRpcProviders } from '@common/services/provider'
import { rpcProviders } from '@common/services/providers'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { isExtension } from '@web/constants/browserapi'
import { ApprovalProvider } from '@web/contexts/approvalContext'
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
                            <ApprovalProvider>
                              <AmbireExtensionProvider>
                                <BiometricsProvider>
                                  {/* <AttentionGrabberProvider> */}
                                  <PrivateModeProvider>
                                    <LinkingProvider>
                                      <AppRouter />
                                    </LinkingProvider>
                                  </PrivateModeProvider>
                                  {/* </AttentionGrabberProvider> */}
                                  <PortalHost name="global" />
                                </BiometricsProvider>
                              </AmbireExtensionProvider>
                            </ApprovalProvider>
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

export default AppInit
