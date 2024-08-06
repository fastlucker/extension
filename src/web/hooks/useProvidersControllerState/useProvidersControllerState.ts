import { useContext } from 'react'

import { ProvidersControllerStateContext } from '@web/contexts/providersControllerStateContext'

export default function useProvidersControllerState() {
  const context = useContext(ProvidersControllerStateContext)

  if (!context) {
    throw new Error(
      'useProvidersControllerState must be used within a ProvidersControllerStateProvider'
    )
  }

  return context
}
