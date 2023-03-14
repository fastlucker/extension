import { useContext } from 'react'

import { BiometricsContext } from '@common/contexts/biometricsContext'

export default function useBiometrics() {
  const context = useContext(BiometricsContext)

  if (!context) {
    throw new Error('useBiometrics must be used within an BiometricsProvider')
  }

  return context
}
