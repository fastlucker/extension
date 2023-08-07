import { useContext } from 'react'

import { MainControllerStateContext } from '@web/contexts/mainControllerStateContext'

export default function useMainControllerState() {
  const context = useContext(MainControllerStateContext)

  if (!context) {
    throw new Error('useMainControllerState must be used within a MainControllerStateProvider')
  }

  return context
}
