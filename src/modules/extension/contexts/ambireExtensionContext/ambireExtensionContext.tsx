import React, { createContext, useMemo } from 'react'

const AmbireExtensionContext = createContext<any>({})

const AmbireExtensionProvider: React.FC = ({ children }) => {
  return (
    <AmbireExtensionContext.Provider value={useMemo(() => ({}), [])}>
      {children}
    </AmbireExtensionContext.Provider>
  )
}

export { AmbireExtensionContext, AmbireExtensionProvider }
