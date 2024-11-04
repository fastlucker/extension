import { useContext } from 'react'

import { DefiPositionsControllerStateContext } from '@web/contexts/defiPositionsControllerStateContext'

export default function useDeFiPositionsControllerState() {
  const context = useContext(DefiPositionsControllerStateContext)

  if (!context) {
    throw new Error(
      'useDeFiPositionsControllerState must be used within a DefiPositionsControllerStateContext'
    )
  }

  return context
}
