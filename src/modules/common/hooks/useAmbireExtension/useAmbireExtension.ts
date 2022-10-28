import { useContext } from 'react'

import { AmbireExtensionContext } from '@modules/common/contexts/ambireExtensionContext'

export default function useAmbireExtension() {
  const context = useContext(AmbireExtensionContext)

  if (!context) {
    throw new Error('useAmbireExtension must be used within an AmbireExtensionProvider')
  }

  return context
}
