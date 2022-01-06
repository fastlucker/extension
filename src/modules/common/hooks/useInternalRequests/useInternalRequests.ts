import { useContext } from 'react'

import { InternalRequestsContext } from '@modules/common/contexts/internalRequestsContext'

export default function useAccounts() {
  const context = useContext(InternalRequestsContext)

  if (!context) {
    throw new Error('useAccounts must be used within an AuthProvider')
  }

  return context
}
