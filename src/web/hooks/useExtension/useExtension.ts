import { useContext } from 'react'

import { ExtensionContext } from '@web/contexts/extensionContext'

export default function useExtension() {
  const context = useContext(ExtensionContext)

  if (!context) {
    throw new Error('useExtension must be used within an ExtensionProvider')
  }

  return context
}
