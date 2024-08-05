// @ts-nocheck TODO: fix provider types

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import ErrorBoundary from '@common/components/ErrorBoundary'
import { BiometricsProvider } from '@common/contexts/biometricsContext'
import { ConnectivityProvider } from '@common/contexts/connectivityContext'
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
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { isExtension } from '@web/constants/browserapi'
import { AccountAdderControllerStateProvider } from '@web/contexts/accountAdderControllerStateContext'
import { AccountsControllerStateProvider } from '@web/contexts/accountsControllerStateContext'
import { ActionsControllerStateProvider } from '@web/contexts/actionsControllerStateContext'
import { ActivityControllerStateProvider } from '@web/contexts/activityControllerStateContext'
import { AddressBookControllerStateProvider } from '@web/contexts/addressBookControllerStateContext'
import { AutoLockControllerStateProvider } from '@web/contexts/autoLockControllerStateContext'
import { BackgroundServiceProvider } from '@web/contexts/backgroundServiceContext'
import { ControllersStateLoadedProvider } from '@web/contexts/controllersStateLoadedContext'
import { DappsControllerStateProvider } from '@web/contexts/dappsControllerStateContext'
import { DomainsControllerStateProvider } from '@web/contexts/domainsControllerStateContext'
import { EmailVaultControllerStateProvider } from '@web/contexts/emailVaultControllerStateContext'
import { InviteControllerStateProvider } from '@web/contexts/inviteControllerStateContext'
import { KeystoreControllerStateProvider } from '@web/contexts/keystoreControllerStateContext'
import { MainControllerStateProvider } from '@web/contexts/mainControllerStateContext'
import { NetworksControllerStateProvider } from '@web/contexts/networksControllerStateContext'
import { PortfolioControllerStateProvider } from '@web/contexts/portfolioControllerStateContext'
import { ProvidersControllerStateProvider } from '@web/contexts/providersControllerStateContext'
import { SettingsControllerStateProvider } from '@web/contexts/settingsControllerStateContext'
import { SignMessageControllerStateProvider } from '@web/contexts/signMessageControllerStateContext'
import { WalletStateControllerProvider } from '@web/contexts/walletStateControllerContext'

const Router = isExtension ? HashRouter : BrowserRouter

const AppInit = () => {
  const { fontsLoaded, robotoFontsLoaded } = useFonts()

  if (!fontsLoaded && !robotoFontsLoaded) return null

  return (
    <Router>
      <PortalProvider>
        <ThemeProvider>
          <ConnectivityProvider>
            <SafeAreaProvider>
              <ToastProvider>
                <ErrorBoundary>
                  <BackgroundServiceProvider>
                    <MainControllerStateProvider>
                      <NetworksControllerStateProvider>
                        <AccountsControllerStateProvider>
                          <ProvidersControllerStateProvider>
                            <AutoLockControllerStateProvider>
                              <InviteControllerStateProvider>
                                <WalletStateControllerProvider>
                                  <SettingsControllerStateProvider>
                                    <AccountAdderControllerStateProvider>
                                      <KeystoreControllerStateProvider>
                                        <SignMessageControllerStateProvider>
                                          <ActivityControllerStateProvider>
                                            <ActionsControllerStateProvider>
                                              <PortfolioControllerStateProvider>
                                                <EmailVaultControllerStateProvider>
                                                  <DappsControllerStateProvider>
                                                    <DomainsControllerStateProvider>
                                                      <AddressBookControllerStateProvider>
                                                        <ControllersStateLoadedProvider>
                                                          <LoaderProvider>
                                                            <StorageProvider>
                                                              <KeyboardProvider>
                                                                <NetInfoProvider>
                                                                  <AuthProvider>
                                                                    <BiometricsProvider>
                                                                      <PrivateModeProvider>
                                                                        <AppRouter />
                                                                      </PrivateModeProvider>
                                                                      <PortalHost name="global" />
                                                                    </BiometricsProvider>
                                                                  </AuthProvider>
                                                                </NetInfoProvider>
                                                              </KeyboardProvider>
                                                            </StorageProvider>
                                                          </LoaderProvider>
                                                        </ControllersStateLoadedProvider>
                                                      </AddressBookControllerStateProvider>
                                                    </DomainsControllerStateProvider>
                                                  </DappsControllerStateProvider>
                                                </EmailVaultControllerStateProvider>
                                              </PortfolioControllerStateProvider>
                                            </ActionsControllerStateProvider>
                                          </ActivityControllerStateProvider>
                                        </SignMessageControllerStateProvider>
                                      </KeystoreControllerStateProvider>
                                    </AccountAdderControllerStateProvider>
                                  </SettingsControllerStateProvider>
                                </WalletStateControllerProvider>
                              </InviteControllerStateProvider>
                            </AutoLockControllerStateProvider>
                          </ProvidersControllerStateProvider>
                        </AccountsControllerStateProvider>
                      </NetworksControllerStateProvider>
                    </MainControllerStateProvider>
                  </BackgroundServiceProvider>
                </ErrorBoundary>
              </ToastProvider>
            </SafeAreaProvider>
          </ConnectivityProvider>
        </ThemeProvider>
      </PortalProvider>
    </Router>
  )
}

export default AppInit
