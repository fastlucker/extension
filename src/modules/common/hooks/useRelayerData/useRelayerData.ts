import { useContext } from 'react'

import { RelayerDataContext } from '@modules/common/contexts/relayerDataContext'

export default function useRelayerData() {
  const context = useContext(RelayerDataContext)

  if (!context) {
    throw new Error('useRelayerData must be used within an RelayerDataProvider')
  }

  return context
}
