import React, { createContext, useMemo } from 'react'

export interface AmbireExtensionContextReturnType {
  connectedDapps: {
    host: string
    status: boolean
  }[]
  params: {
    route?: string
    host?: string
    queue?: string
  }
  requests: any[] | null
  isTempExtensionPopup: boolean
  lastActiveTab: any
  resolveMany: (ids: any, resolution: any) => any
  setParams: React.Dispatch<
    React.SetStateAction<{
      route?: string
      host?: string
      queue?: string
    }>
  >
  disconnectDapp: (hast: string) => void
}

const AmbireExtensionContext = createContext<AmbireExtensionContextReturnType>({
  connectedDapps: [],
  params: {},
  requests: [],
  isTempExtensionPopup: false,
  lastActiveTab: null,
  resolveMany: () => {},
  setParams: () => null,
  disconnectDapp: () => {}
})
const AmbireExtensionProvider: React.FC = ({ children }) => {
  return (
    <AmbireExtensionContext.Provider value={useMemo(() => ({}), [])}>
      {children}
    </AmbireExtensionContext.Provider>
  )
}

export { AmbireExtensionContext, AmbireExtensionProvider }
