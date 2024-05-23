import { useContext } from 'react'

import { ActionsControllerStateContext } from '@web/contexts/actionsControllerStateContext'

export default function useActionsControllerState() {
  const context = useContext(ActionsControllerStateContext)

  if (!context) {
    throw new Error(
      'useActionsControllerState must be used within a ActionsControllerStateProvider'
    )
  }

  return context
}
