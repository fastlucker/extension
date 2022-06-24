import { useContext } from 'react'

import { PrivateModeContext } from '@modules/common/contexts/privateModeContext'

export default function usePrivateMode() {
  const context = useContext(PrivateModeContext)

  if (!context) {
    throw new Error('usePrivateMode must be used within an PrivateModeProvider')
  }

  return context
}
