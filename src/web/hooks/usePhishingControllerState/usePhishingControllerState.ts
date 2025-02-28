import { useContext } from 'react'

import { PhishingControllerStateContext } from '@web/contexts/phishingControllerStateContext'

export default function usePhishingControllerState() {
  const context = useContext(PhishingControllerStateContext)

  if (!context) {
    throw new Error(
      'usePhishingControllerState must be used within a PhishingControllerStateProvider'
    )
  }

  return context
}
