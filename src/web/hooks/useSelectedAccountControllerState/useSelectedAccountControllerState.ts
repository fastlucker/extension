import { useContext } from 'react'

import { SelectedAccountControllerStateContext } from '@web/contexts/selectedAccountControllerStateContext'

export default function useSelectedAccountControllerState() {
  const context = useContext(SelectedAccountControllerStateContext)

  if (!context) {
    throw new Error(
      'useSelectedAccountControllerState must be used within a SelectedAccountControllerStateProvider'
    )
  }

  return context
}
