import React, { createContext } from 'react'

import { accountsPasswordsContextDefaults, AccountsPasswordsContextReturnType } from './types'

const AccountsPasswordsContext = createContext<AccountsPasswordsContextReturnType>(
  accountsPasswordsContextDefaults
)

// This context is needed for the web app only. For mobile, fallback to defaults.
const AccountsPasswordsProvider: React.FC = ({ children }) => children

export { AccountsPasswordsContext, AccountsPasswordsProvider }
