import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter } from 'react-router-dom'

import { areRpcProvidersInitialized, initRpcProviders } from '@ambire-common/services/provider'
import { ThemeProvider } from '@common/contexts/themeContext'
import { ToastProvider } from '@common/contexts/toastContext'
import useFonts from '@common/hooks/useFonts'
import { rpcProviders } from '@common/services/providers'
import { PortalHost, PortalProvider } from '@gorhom/portal'

import BenzinScreen from './screens/BenzinScreen'

// Initialize rpc providers for all networks
// @TODO: get rid of this and use the rpc providers from the settings controller
const shouldInitProviders = !areRpcProvidersInitialized()
if (shouldInitProviders) {
  initRpcProviders(rpcProviders)
}

const BenzinInit = () => {
  const { fontsLoaded, robotoFontsLoaded } = useFonts()

  if (!fontsLoaded && !robotoFontsLoaded) return null

  return (
    <BrowserRouter>
      <PortalProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <ToastProvider>
              <BenzinScreen />
              <PortalHost name="global" />
            </ToastProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </PortalProvider>
    </BrowserRouter>
  )
}

export default BenzinInit
