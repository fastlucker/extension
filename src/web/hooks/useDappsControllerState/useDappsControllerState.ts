import { useContext } from 'react'

import { DappsControllerStateContext } from '@web/contexts/dappsControllerStateContext'

export default function useDappsControllerState() {
  const context = useContext(DappsControllerStateContext)

  if (!context) {
    throw new Error('useDappsControllerState must be used within a DappsControllerStateProvider')
  }

  return context
}
