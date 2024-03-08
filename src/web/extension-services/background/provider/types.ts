import { MainController } from '@ambire-common/controllers/main/main'
import { DappsController } from '@web/extension-services/background/controllers/dapps'
import { NotificationController } from '@web/extension-services/background/controllers/notification'
import { Session } from '@web/extension-services/background/services/session'

export type ProviderRequest<TMethod = string> = {
  data: {
    method: TMethod
    params?: any
    $ctx?: any
  }
  session: Session
  origin?: string
  requestedNotificationRequest?: boolean
  mainCtrl: MainController
  notificationCtrl: NotificationController
  dappsCtrl: DappsController
}
