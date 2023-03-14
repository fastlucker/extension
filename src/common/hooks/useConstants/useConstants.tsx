import { useContext } from 'react'

import { ConstantsContext } from '@common/contexts/constantsContext'

export default function useConstants() {
  const context = useContext(ConstantsContext)

  if (!context) {
    throw new Error('useConstants must be used within an ConstantsProvider')
  }

  return context
}
