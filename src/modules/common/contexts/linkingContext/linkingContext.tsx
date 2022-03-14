import * as Linking from 'expo-linking'
import React, { createContext, useEffect } from 'react'

import useWalletConnect from '@modules/common/hooks/useWalletConnect'

type LinkingContextData = {}

const LinkingContext = createContext<LinkingContextData>({})

const LinkingProvider: React.FC<any> = ({ children }) => {
  const { handleConnect } = useWalletConnect()

  const handleIncomingURL = (url: string | null) => {
    if (!url) return

    if (url.startsWith('wc:')) {
      handleConnect(url)
    } else if (url.includes('uri=wc:')) {
      handleConnect(url.slice(url.indexOf('wc:')))
    }
  }

  useEffect(() => {
    Linking.getInitialURL().then(handleIncomingURL)

    const listenForIncomingURL = (e: any) => handleIncomingURL(e.url)
    Linking.addEventListener('url', listenForIncomingURL)

    return () => {
      Linking.removeEventListener('url', listenForIncomingURL)
    }
  }, [])

  return (
    // In case we need to provide some values in the future - replace children with the provider
    // <LinkingContext.Provider value={useMemo(() => ({}), [])}>{children}</LinkingContext.Provider>
    children
  )
}

export { LinkingContext, LinkingProvider }
