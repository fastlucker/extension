import { useContext } from 'react'

import { JsonLoginContext } from '@mobile/auth/contexts/jsonLoginContext'

export default function useJsonLogin() {
  const context = useContext(JsonLoginContext)

  if (!context) {
    throw new Error('useJsonLogin must be used within an JsonLoginProvider')
  }

  return context
}
