import { useContext } from 'react'

import { legendsContext } from '@legends/contexts/legendsContext'

export default function useLegendsContext() {
  const context = useContext(legendsContext)

  if (!context) {
    throw new Error('useLegendsContext must be used within a legendsContext')
  }

  return context
}
