import { useContext } from 'react'

import { VaultContext } from '@mobile/vault/contexts/vaultContext'

export default function useVault() {
  const context = useContext(VaultContext)

  if (!context) {
    throw new Error('useVault must be used within an VaultProvider')
  }

  return context
}
