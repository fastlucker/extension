import { useContext } from 'react'

import { BiometricsSignContext } from '@modules/biometrics-sign/contexts/biometricsSignContext'

export default function useBiometricsSign() {
  const context = useContext(BiometricsSignContext)

  if (!context) {
    throw new Error('useBiometricsSign must be used within an BiometricsSignProvider')
  }

  return context
}
