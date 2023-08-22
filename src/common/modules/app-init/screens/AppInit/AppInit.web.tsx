// @ts-nocheck TODO: fix provider types

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter, HashRouter } from 'react-router-dom'

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
import { areRpcProvidersInitialized, initRpcProviders } from '@common/services/provider'
import { rpcProviders } from '@common/services/providers'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { isExtension } from '@web/constants/browserapi'
import { AccountAdderControllerStateProvider } from '@web/contexts/accountAdderControllerStateContext'
import { ApprovalProvider } from '@web/contexts/approvalContext'
import { BackgroundServiceProvider } from '@web/contexts/backgroundServiceContext'
import { ControllersStateLoadedProvider } from '@web/contexts/controllersStateLoadedContext'
import { ExtensionProvider } from '@web/contexts/extensionContext'
import { KeystoreControllerStateProvider } from '@web/contexts/keystoreControllerStateContext'
import { MainControllerStateProvider } from '@web/contexts/mainControllerStateContext'

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
      <MainControllerStateProvider>
        <AccountAdderControllerStateProvider>
          <KeystoreControllerStateProvider>
            <ControllersStateLoadedProvider>
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
                                    <ApprovalProvider>
                                      <ExtensionProvider>
                                        <BiometricsProvider>
                                          <PrivateModeProvider>
                                            <AppRouter />
                                          </PrivateModeProvider>
                                          <PortalHost name="global" />
                                        </BiometricsProvider>
                                      </ExtensionProvider>
                                    </ApprovalProvider>
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
            </ControllersStateLoadedProvider>
          </KeystoreControllerStateProvider>
        </AccountAdderControllerStateProvider>
      </MainControllerStateProvider>
    </BackgroundServiceProvider>
  )
}

export default AppInit
