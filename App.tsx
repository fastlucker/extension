import { StatusBar } from 'expo-status-bar'
import React from 'react'

import Router from '@config/Router'
import { AuthProvider } from '@modules/auth/contexts/authContext'
import { AccountsProvider } from '@modules/common/contexts/accountsContext'

// So that the localization gets initialized at the beginning.
import '@config/localization'

const App = () => (
  <>
    <StatusBar style="auto" />
    <AuthProvider>
      <AccountsProvider>
        <Router />
      </AccountsProvider>
    </AuthProvider>
  </>
)

export default App
