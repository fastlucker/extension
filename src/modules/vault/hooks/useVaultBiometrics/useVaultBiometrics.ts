import { useContext } from 'react'

import { VaultBiometricsContext } from '@modules/vault/contexts/vaultBiometricsContext'

export default function useVaultBiometrics() {
  const context = useContext(VaultBiometricsContext)

  if (!context) {
    throw new Error('useVaultBiometrics must be used within an VaultBiometricsProvider')
  }

  return context
}
