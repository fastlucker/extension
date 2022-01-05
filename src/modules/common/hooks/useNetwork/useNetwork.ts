import { useContext } from 'react'

import { NetworkContext } from '@modules/common/contexts/networkContext/networkContext'

export default function useNetwork() {
  const context = useContext(NetworkContext)

  if (!context) {
    throw new Error('useNetwork must be used within an NetworkProvider')
  }

  return context
}
