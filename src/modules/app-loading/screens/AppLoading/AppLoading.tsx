import { initRpcProviders } from 'ambire-common/src/services/provider'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Router from '@config/Router'
import { hasMigratedFromAsyncStorage, migrateFromAsyncStorage } from '@config/storage'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AppLockProvider } from '@modules/app-lock/contexts/appLockContext'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import { BiometricsSignProvider } from '@modules/biometrics-sign/contexts/biometricsSignContext'
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
import { ThemeProvider } from '@modules/common/contexts/themeContext'
import { ToastProvider } from '@modules/common/contexts/toastContext'
import { UnsupportedDAppsBottomSheetProvider } from '@modules/common/contexts/unsupportedDAppsBottomSheetContext'
import { WalletConnectProvider } from '@modules/common/contexts/walletConnectContext'
import useFonts from '@modules/common/hooks/useFonts'
import { rpcProviders } from '@modules/common/services/providers'
import { VaultProvider } from '@modules/vault/contexts/vaultContext'

// Initialize rpc providers for all networks
initRpcProviders(rpcProviders)

const AppLoading = () => {
  // TODO: Remove `hasMigratedFromAsyncStorage` after a while (when everyone has migrated)
  const [hasMigrated, setHasMigrated] = useState(hasMigratedFromAsyncStorage)
  const { fontsLoaded } = useFonts()

  useEffect(() => {
    ;(async () => {
      if (!hasMigratedFromAsyncStorage) {
        try {
          await migrateFromAsyncStorage()
          setHasMigrated(true)
        } catch (e) {
          throw new Error('AsyncStorage migration failed!')
        }
      }
    })()
  }, [])

  if (!fontsLoaded || !hasMigrated) return null

  return (
    <PortalProvider>
      <LoaderProvider>
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
                                    <VaultProvider>
                                      <AddressBookProvider>
                                        <BiometricsProvider>
                                          <BiometricsSignProvider>
                                            <AppLockProvider>
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
                                            </AppLockProvider>
                                          </BiometricsSignProvider>
                                        </BiometricsProvider>
                                      </AddressBookProvider>
                                    </VaultProvider>
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
      </LoaderProvider>
    </PortalProvider>
  )
}

export default AppLoading
