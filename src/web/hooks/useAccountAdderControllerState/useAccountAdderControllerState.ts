import { useContext } from 'react'

import { AccountAdderControllerStateContext } from '@web/contexts/accountAdderControllerStateContext'

export default function useAccountAdderControllerState() {
  const context = useContext(AccountAdderControllerStateContext)

  if (!context) {
    throw new Error(
      'useAccountAdderController must be used within a AccountAdderControllerProvider'
    )
  }

  return context
}
