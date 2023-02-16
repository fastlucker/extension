import useWalletConnect, { UseWalletConnectReturnType } from 'ambire-common/src/hooks/useWalletConnect'
import React, { createContext, useCallback, useMemo } from 'react'

import i18n from '@config/localization/localization'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'
import useToasts from '@modules/common/hooks/useToast'

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

const WalletConnectProvider: React.FC = ({ children }) => {
  const { addToast } = useToasts()
  const { connections, requests, isConnecting, connect, disconnect, resolveMany } =
    useWalletConnect({
      useAccounts,
      useNetwork,
      useStorage,
      useToasts
    })

  const handleConnect = useCallback(
    (uri: string) => {
      if (uri.startsWith('wc:')) {
        connect({ uri })
      } else {
        addToast(i18n.t('Invalid link. Refresh the dApp and try again.') as string, {
          error: true
        })
      }
    },
    [connect, addToast]
  )

  return (
    <WalletConnectContext.Provider
      value={useMemo(
        () => ({
          connections,
          requests,
          isConnecting,
          resolveMany,
          connect,
          disconnect,
          handleConnect
        }),
        [connections, requests, isConnecting, resolveMany, connect, disconnect, handleConnect]
      )}
    >
      {children}
    </WalletConnectContext.Provider>
  )
}

export { WalletConnectContext, WalletConnectProvider }
