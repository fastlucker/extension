import { useContext } from 'react'

import { AccountsContext } from '@modules/common/contexts/accountsContext'

export default function useAccounts() {
  const context = useContext(AccountsContext)

  if (!context) {
    throw new Error('useAccounts must be used within an AuthProvider')
  }

  return context
}
