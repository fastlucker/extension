import { MainController } from 'ambire-common/src/controllers/main/main'

export type ProviderRequest<TMethod = string> = {
  data: {
    method: TMethod
    params?: any
    $ctx?: any
  }
  session?: {
    name: string
    origin: string
    icon: string
  } | null
  origin?: string
  requestedApproval?: boolean
  mainCtrl: MainController
}
