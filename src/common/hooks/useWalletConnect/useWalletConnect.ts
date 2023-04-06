import { useContext } from 'react'

import { WalletConnectContext } from '@common/contexts/walletConnectContext'

export default function useWalletConnect() {
  const context = useContext(WalletConnectContext)

  if (!context) {
    throw new Error('useWalletConnect must be used within an WalletConnectProvider')
  }

  return context
}
