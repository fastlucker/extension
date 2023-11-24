import { useContext } from 'react'

import { SignAccountOpControllerStateContext } from '@web/contexts/signAccountOpControllerStateContext'

export default function useSignAccountOpControllerState() {
  const context = useContext(SignAccountOpControllerStateContext)

  if (context === undefined) {
    throw new Error(
      'useSignAccountOpControllerState must be used within a SignAccountOpControllerStateProvider'
    )
  }

  return context
}
