import { useContext } from 'react'

import { ActivityControllerStateContext } from '@web/contexts/activityControllerStateContext'

export default function useActivityControllerState() {
  const context = useContext(ActivityControllerStateContext)

  if (!context) {
    throw new Error(
      'useActivityControllerState must be used within an ActivityControllerStateProvider'
    )
  }

  return context
}
