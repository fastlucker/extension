import { useContext } from 'react'

import { AppLockContext } from '@modules/app-lock/contexts/appLockContext'

export default function useAppLock() {
  const context = useContext(AppLockContext)

  if (!context) {
    throw new Error('useAppLock must be used within an AppLockProvider')
  }

  return context
}
