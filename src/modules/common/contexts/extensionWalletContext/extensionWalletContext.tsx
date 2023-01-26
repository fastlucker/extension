import { createContext } from 'react'

import { WalletController } from './types'

// This context is needed for the browser extension only. For mobile, fallback to defaults.
const ExtensionWalletContext = createContext<{
  wallet: WalletController
} | null>(null)

const ExtensionWalletProvider: React.FC<any> = ({ children }) => children

export { ExtensionWalletProvider, ExtensionWalletContext }
