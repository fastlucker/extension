import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BrowserRouter } from 'react-router-dom'

import { ToastProvider } from '@common/contexts/toastContext'
import useFonts from '@common/hooks/useFonts'
import { PortalHost, PortalProvider } from '@gorhom/portal'

import Router from './modules/router/Router'

const BenzinInit = () => {
  const { fontsLoaded, robotoFontsLoaded } = useFonts()

  if (!fontsLoaded && !robotoFontsLoaded) return null

  return (
    <BrowserRouter>
      <PortalProvider>
        <SafeAreaProvider>
          {/* TODO: Theme provider is purposefully missing because the theme is not yet implemented and
          the colours will most likely be different from the ones in themeConfig.ts */}
          <ToastProvider>
            <Router />
            <PortalHost name="global" />
          </ToastProvider>
        </SafeAreaProvider>
      </PortalProvider>
    </BrowserRouter>
  )
}

export default BenzinInit
