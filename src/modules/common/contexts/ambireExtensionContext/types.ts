import { ConnectedSite } from '@web/background/services/permission'

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
  site: ConnectedSite | null
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

export const ambireExtensionContextDefaults = {
  connectedDapps: [],
  params: {},
  requests: [],
  isTempExtensionPopup: false,
  site: null,
  resolveMany: () => {},
  setParams: () => null,
  disconnectDapp: () => {}
}
