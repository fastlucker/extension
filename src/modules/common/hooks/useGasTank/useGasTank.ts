import { useContext } from 'react'

import { GasTankContext } from '@modules/common/contexts/gasTankContext'

export default function useGasTank() {
  const context = useContext(GasTankContext)

  if (!context) {
    throw new Error('useGasTank must be used within an GasTankProvider')
  }

  return context
}
