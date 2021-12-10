import { StatusBar } from 'expo-status-bar'
import React from 'react'

import Router from '@config/Router'
import { AuthProvider } from '@modules/auth/contexts/auth'
// So that the localization gets initialized at the beginning.
import '@config/localization'

const App = () => (
  <>
    <StatusBar style="auto" />
    <AuthProvider>
      <Router />
    </AuthProvider>
  </>
)

export default App
