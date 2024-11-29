import { useContext } from 'react'

import { RecentActivityContext } from '@legends/contexts/recentActivityContext'

export default function useRecentActivityContext() {
  const context = useContext(RecentActivityContext)

  if (!context) {
    throw new Error('useRecentActivityContext must be used within a RecentActivityContext')
  }

  return context
}
