import { useContext } from 'react'

import { ExtensionUpdateControllerStateContext } from '@web/contexts/extensionUpdateControllerStateContext'

export default function useExtensionUpdateControllerState() {
  const context = useContext(ExtensionUpdateControllerStateContext)

  if (!context) {
    throw new Error(
      'useExtensionUpdateControllerState must be used within ExtensionUpdateControllerStateProvider'
    )
  }

  return context
}
