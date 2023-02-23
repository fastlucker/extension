import { ConnectedSite } from '@web/background/services/permission'

export interface AmbireExtensionContextReturnType {
  connectedDapps: ConnectedSite[]
  site: ConnectedSite | null
  disconnectDapp: (origin: ConnectedSite['origin']) => void
}

export const ambireExtensionContextDefaults = {
  connectedDapps: [],
  site: null,
  disconnectDapp: () => Promise.resolve()
}
