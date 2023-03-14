import { useContext } from 'react'

import { RequestsContext } from '@common/contexts/requestsContext'

export default function useRequests() {
  const context = useContext(RequestsContext)

  if (!context) {
    throw new Error('useRequests must be used within an RequestsProvider')
  }

  return context
}
