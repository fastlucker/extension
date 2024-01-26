import { useContext } from 'react'

import { WalletStateControllerContext } from '@web/contexts/walletStateControllerContext'

export default function useWalletStateController() {
  const context = useContext(WalletStateControllerContext)

  if (!context) {
    throw new Error('useWalletStateController must be used within a WalletStateControllerProvider')
  }

  return context
}
