import * as Linking from 'expo-linking'
import React, { createContext, useCallback, useEffect } from 'react'

import useWalletConnect from '@common/hooks/useWalletConnect'
import { isAndroid, isWeb } from '@config/env'

export interface LinkingContextReturnType {}

const LinkingContext = createContext<LinkingContextReturnType>({})

const LinkingProvider: React.FC<any> = ({ children }) => {
  const { handleConnect } = useWalletConnect()

  const handleIncomingURL = useCallback(
    (url: string | null) => {
      if (!url) return

      // Handle incoming WalletConnect URI (coming from a deep link)
      if (isAndroid && url.startsWith('wc:')) {
        handleConnect(url)
      } else if (url.includes('uri=wc:')) {
        handleConnect(url.slice(url.indexOf('wc:')))
      }
    },
    [handleConnect]
  )

  useEffect(() => {
    // Mobile specific deep linking mechanism
    if (isWeb) return

    Linking.getInitialURL().then(handleIncomingURL)

    const listenForIncomingURL = (e: any) => handleIncomingURL(e.url)
    const listener = Linking.addEventListener('url', listenForIncomingURL)

    return () => {
      listener.remove()
    }
  }, [handleIncomingURL])

  return (
    // In case we need to provide some values in the future - replace children with the provider
    // <LinkingContext.Provider value={useMemo(() => ({}), [])}>{children}</LinkingContext.Provider>
    children
  )
}

export { LinkingContext, LinkingProvider }
