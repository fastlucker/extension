import { StatusBar } from 'expo-status-bar'
import React from 'react'

import Router from '@config/Router'
import { AuthProvider } from '@modules/auth/contexts/auth'
import { setLocale } from '@config/localization'

// Sets the locale once, at the beginning of the app.
setLocale()

const App = () => (
  <>
    <StatusBar style="auto" />
    <AuthProvider>
      <Router />
    </AuthProvider>
  </>
)

export default App
