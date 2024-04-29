import { useContext } from 'react'

import { AutoLockControllerStateContext } from '@web/contexts/autoLockControllerStateContext'

export default function useAutoLockStateController() {
  const context = useContext(AutoLockControllerStateContext)

  if (!context) {
    throw new Error(
      'useAutoLockStateController must be used within a AutoLockControllerStateProvider'
    )
  }

  return context
}
