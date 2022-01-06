import { useContext } from 'react'

import { InternalRequestsContext } from '@modules/common/contexts/internalRequestsContext'

export default function useInternalRequests() {
  const context = useContext(InternalRequestsContext)

  if (!context) {
    throw new Error('useInternalRequests must be used within an InternalRequestsProvider')
  }

  return context
}
