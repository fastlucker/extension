import { useContext } from 'react'

import { ExtensionWalletContext } from '@modules/common/contexts/extensionWalletContext'

export default function useWallet() {
  const context = useContext(ExtensionWalletContext)

  if (!context) {
    throw new Error('useWallet must be used within an WalletProvider')
  }

  return context
}
