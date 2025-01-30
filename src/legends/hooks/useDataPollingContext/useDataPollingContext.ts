import { useContext } from 'react'

import { DataPollingContext } from '@legends/contexts/dataPollingContext'

export default function useDataPollingContext() {
  const context = useContext(DataPollingContext)

  if (!context) {
    throw new Error('useDataPollingContext must be used within a DataPollingContext')
  }

  return context
}
