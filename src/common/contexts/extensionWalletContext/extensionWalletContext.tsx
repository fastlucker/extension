import React, { createContext, useMemo } from 'react'

import {
  extensionWalletContextDefaults,
  ExtensionWalletContextReturnType
} from '@common/contexts/extensionWalletContext/types'

// This context is needed for the browser extension only. For mobile, fallback to defaults.
const ExtensionWalletContext = createContext<ExtensionWalletContextReturnType>(
  extensionWalletContextDefaults
)

const ExtensionWalletProvider: React.FC<any> = ({ children }) => (
  <ExtensionWalletContext.Provider value={useMemo(() => extensionWalletContextDefaults, [])}>
    {children}
  </ExtensionWalletContext.Provider>
)

export { ExtensionWalletProvider, ExtensionWalletContext }
