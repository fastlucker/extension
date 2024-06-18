import { useContext } from 'react'

import { AccountsControllerStateContext } from '@web/contexts/accountsControllerStateContext'

export default function useAccountsControllerState() {
  const context = useContext(AccountsControllerStateContext)

  if (!context) {
    throw new Error(
      'useAccountsControllerState must be used within a AccountsControllerStateProvider'
    )
  }

  return context
}
