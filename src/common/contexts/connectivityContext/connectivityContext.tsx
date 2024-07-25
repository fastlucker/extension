import React, { createContext, useEffect, useMemo, useState } from 'react'

const ConnectivityContext = createContext<{
  isOffline: boolean
}>({
  isOffline: false
})

const ConnectivityProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Function to update connectivity status
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Check the initial connectivity status
    updateOnlineStatus()

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const contextValue = useMemo(() => ({ isOffline }), [isOffline])

  return (
    <ConnectivityContext.Provider value={contextValue}>{children}</ConnectivityContext.Provider>
  )
}

export { ConnectivityContext, ConnectivityProvider }
