import { createContext } from 'react'

import { ExtensionWalletController } from '@modules/common/contexts/extensionWalletContext/types'

// This context is needed for the browser extension only. For mobile, fallback to defaults.
const ExtensionWalletContext = createContext<{
  extensionWallet: ExtensionWalletController
} | null>(null)

const ExtensionWalletProvider: React.FC<any> = ({ children }) => children

export { ExtensionWalletProvider, ExtensionWalletContext }
