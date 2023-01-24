import React, { createContext, ReactNode, useMemo } from 'react'

import { WalletController } from './types'

const WalletContext = createContext<{
  wallet: WalletController
} | null>(null)

const WalletProvider = ({
  children,
  wallet
}: {
  children?: ReactNode
  wallet: WalletController
}) => (
  <WalletContext.Provider
    value={useMemo(
      () => ({
        wallet
      }),
      [wallet]
    )}
  >
    {children}
  </WalletContext.Provider>
)

export { WalletProvider, WalletContext }
