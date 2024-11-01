import { useContext } from 'react'

import { DefiPositionsControllerStateContext } from '@web/contexts/defiPositionsControllerStateContext'

export default function useDefiPositionsControllerState() {
  const context = useContext(DefiPositionsControllerStateContext)

  if (!context) {
    throw new Error(
      'useDefiPositionsControllerState must be used within a DefiPositionsControllerStateProvider'
    )
  }

  return context
}
