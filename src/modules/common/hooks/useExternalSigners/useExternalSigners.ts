import { useContext } from 'react'

import { ExternalSignersContext } from '@modules/common/contexts/externalSignersContext'

export default function useExternalSigners() {
  const context = useContext(ExternalSignersContext)

  if (!context) {
    throw new Error('useExternalSigners must be used within an ExternalSignersProvider')
  }

  return context
}
