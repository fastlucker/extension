import { UseWalletConnectReturnType } from 'ambire-common/src/hooks/useWalletConnect'
import React, { createContext } from 'react'

export interface WalletConnectContextReturnType extends UseWalletConnectReturnType {
  handleConnect: (uri: string) => void
}

const WalletConnectContext = createContext<WalletConnectContextReturnType>({
  connections: [],
  requests: [],
  isConnecting: false,
  resolveMany: () => {},
  connect: () => new Promise(() => {}),
  disconnect: () => {},
  handleConnect: () => {}
})

// This context currently is needed for the mobile app only. For the iOS/web/extension, fallback to defaults.
const WalletConnectProvider: React.FC = ({ children }) => children

export { WalletConnectContext, WalletConnectProvider }
