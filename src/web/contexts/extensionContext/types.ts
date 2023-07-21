import { ConnectedSite } from '@web/extension-services/background/services/permission'

export interface ExtensionContextReturnType {
  connectedDapps: ConnectedSite[]
  site: ConnectedSite | null
  disconnectDapp: (origin: ConnectedSite['origin']) => void
}

export const extensionContextDefaults = {
  connectedDapps: [],
  site: null,
  disconnectDapp: () => Promise.resolve()
}
