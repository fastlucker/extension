import { MainController } from 'ambire-common/src/controllers/main/main'

import { NotificationController } from '@web/extension-services/background/controllers/notification'

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
  notificationCtrl: NotificationController
}
