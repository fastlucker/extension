import { useContext } from 'react'

import { NetInfoContext } from '@modules/common/contexts/netInfoContext'

export default function useNetInfo() {
  const context = useContext(NetInfoContext)

  if (!context) {
    throw new Error('useNetInfo must be used within an NetInfoProvider')
  }

  return context
}
