import { useContext } from 'react'

import { DomainsControllerStateContext } from '@web/contexts/domainsControllerStateContext'

export default function useDomainsControllerState() {
  const context = useContext(DomainsControllerStateContext)

  if (!context) {
    throw new Error('useDomainsControllerState must be used within a DomainsControllerStateContext')
  }

  return context
}
