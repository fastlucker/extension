import { createContext, ReactNode } from 'react'

import { WalletController } from './types'

const WalletContext = createContext<{
  wallet: WalletController
} | null>(null)

const WalletProvider = ({ children }: { children?: ReactNode; wallet: WalletController }) =>
  children

export { WalletProvider, WalletContext }
