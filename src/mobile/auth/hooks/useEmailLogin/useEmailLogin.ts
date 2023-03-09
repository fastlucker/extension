import { useContext } from 'react'

import { EmailLoginContext } from '@mobile/auth/contexts/emailLoginContext'

export default function useEmailLogin() {
  const context = useContext(EmailLoginContext)

  if (!context) {
    throw new Error('useEmailLogin must be used within an EmailLoginProvider')
  }

  return context
}
