import { useContext } from 'react'

import { IdentityInfoContext } from '@web/contexts/identityInfoContext'

export default function useIdentityInfo() {
  const context = useContext(IdentityInfoContext)

  if (!context) {
    throw new Error('useIdentityInfo must be used within a IdentityInfoProvider')
  }

  return context
}
