import { ConnectedSite } from '@web/background/services/permission'

export interface AmbireExtensionContextReturnType {
  connectedDapps: ConnectedSite[]
  requests: any[] | null
  site: ConnectedSite | null
  resolveMany: (ids: any, resolution: any) => any
  setParams: React.Dispatch<
    React.SetStateAction<{
      route?: string
      host?: string
      queue?: string
    }>
  >
  disconnectDapp: (origin: ConnectedSite['origin']) => void
}

export const ambireExtensionContextDefaults = {
  connectedDapps: [],
  requests: [],
  site: null,
  resolveMany: () => {},
  setParams: () => null,
  disconnectDapp: () => Promise.resolve()
}
