import { useContext } from 'react'

import { ConnectivityContext } from '@common/contexts/connectivityContext'

export default function useConnectivity() {
  const context = useContext(ConnectivityContext)

  if (!context) {
    throw new Error('useConnectivity must be used within an ConnectivityProvider')
  }

  return context
}
