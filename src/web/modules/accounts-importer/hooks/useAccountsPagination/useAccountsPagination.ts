import { useContext } from 'react'

import { AccountsPaginationContext } from '@web/modules/accounts-importer/contexts/accountsPaginationContext'

export default function useAccountsPagination() {
  const context = useContext(AccountsPaginationContext)

  if (!context) {
    throw new Error('useAccountsPagination must be used within an AccountsPaginationProvider')
  }

  return context
}
