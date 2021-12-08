import { StatusBar } from 'expo-status-bar'
import React from 'react'

import Router from '@config/Router'
import { AuthProvider } from '@modules/auth/contexts/auth'

const App = () => (
  <>
    <StatusBar style="auto" />
    <AuthProvider>
      <Router />
    </AuthProvider>
  </>
)

export default App
