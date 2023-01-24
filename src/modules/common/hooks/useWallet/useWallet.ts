import { useContext } from 'react'

import { WalletContext } from '@modules/common/contexts/walletContext'

export default function useWallet() {
  const context = useContext(WalletContext)

  if (!context) {
    throw new Error('useWallet must be used within an WalletProvider')
  }

  return context
}
