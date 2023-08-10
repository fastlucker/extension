import { useContext } from 'react'

import { BackgroundServiceContext } from '@web/contexts/backgroundServiceContext'

export default function useBackgroundService() {
  const context = useContext(BackgroundServiceContext)

  if (!context) {
    throw new Error('useBackgroundService must be used within an BackgroundServiceProvider')
  }

  return context
}
