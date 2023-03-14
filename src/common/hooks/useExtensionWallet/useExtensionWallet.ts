import { useContext } from 'react'

import { ExtensionWalletContext } from '@common/contexts/extensionWalletContext'

export default function useExtensionWallet() {
  const context = useContext(ExtensionWalletContext)

  if (!context) {
    throw new Error('useExtensionWallet must be used within an ExtensionWalletProvider')
  }

  return context
}
