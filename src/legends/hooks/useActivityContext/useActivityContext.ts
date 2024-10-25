import { useContext } from 'react'

import { ActivityContext } from '@legends/contexts/activityContext'

export default function useActivityContext() {
  const context = useContext(ActivityContext)

  if (!context) {
    throw new Error('useActivityContext must be used within a ActivityContext')
  }

  return context
}
