import { useContext } from 'react'

import { NetworksControllerStateContext } from '@web/contexts/networksControllerStateContext'

export default function useNetworksControllerState() {
  const context = useContext(NetworksControllerStateContext)

  if (!context) {
    throw new Error(
      'useNetworksControllerState must be used within a NetworksControllerStateProvider'
    )
  }

  return context
}
