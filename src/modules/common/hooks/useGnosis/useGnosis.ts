import { useContext } from 'react'

import { GnosisContext } from '@modules/common/contexts/gnosisContext'

export default function useGnosis() {
  const context = useContext(GnosisContext)

  if (!context) {
    throw new Error('useGnosis must be used within an GnosisProvider')
  }

  return context
}
