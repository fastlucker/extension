import { useContext } from 'react'

import { SwapAndBridgeControllerStateContext } from '@web/contexts/swapAndBridgeControllerStateContext'

export default function useSwapAndBridgeControllerState() {
  const context = useContext(SwapAndBridgeControllerStateContext)

  if (!context) {
    throw new Error(
      'useSwapAndBridgeControllerState must be used within a SwapAndBridgeControllerStateProvider'
    )
  }

  return context
}
