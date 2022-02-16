import { useContext } from 'react'

import { WalletConnectContext } from '@modules/common/contexts/walletConnectContext'

export default function useWalletConnect() {
  const context = useContext(WalletConnectContext)

  if (!context) {
    throw new Error('useWalletConnect must be used within an WalletConnectProvider')
  }

  return context
}
