import { useContext } from 'react'

import { AccountsPasswordsContext } from '@modules/common/contexts/accountsPasswordsContext'

export default function useAccountsPasswords() {
  const context = useContext(AccountsPasswordsContext)

  if (!context) {
    throw new Error('useAccountsPasswords must be used within an AccountsPasswordsProvider')
  }

  return context
}
