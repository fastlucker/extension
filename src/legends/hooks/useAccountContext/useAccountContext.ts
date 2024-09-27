import { useContext } from 'react'

import { accountContext } from '@legends/contexts/accountContext'

export default function useAccountContext() {
  const context = useContext(accountContext)

  if (!context) {
    throw new Error('useAccountContext must be used within a accountContext')
  }

  return context
}
