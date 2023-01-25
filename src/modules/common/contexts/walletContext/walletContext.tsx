import { createContext } from 'react'

import { WalletController } from './types'

// This context is needed for the browser extension only. For mobile, fallback to defaults.
const WalletContext = createContext<{
  wallet: WalletController
} | null>(null)

const WalletProvider: React.FC<any> = ({ children }) => children

export { WalletProvider, WalletContext }
