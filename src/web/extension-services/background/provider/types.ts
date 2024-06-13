import { MainController } from '@ambire-common/controllers/main/main'
import { DappsController } from '@web/extension-services/background/controllers/dapps'
import { Session } from '@web/extension-services/background/services/session'

export type ProviderRequest<TMethod = string> = {
  method: TMethod
  params?: any
  session: Session
  origin: string
}

export type ProviderNeededControllers = {
  mainCtrl: MainController
  dappsCtrl: DappsController
}

export type RequestRes = {
  type?: string
  address?: string
  uiRequestComponent?: string
  isSend?: boolean
  isSpeedUp?: boolean
  isCancel?: boolean
  isSwap?: boolean
  isGnosis?: boolean
  account?: any
  extra?: Record<string, any>
  traceId?: string
  signingTxId?: string
  hash?: string
  error?: string
  isUserOp?: boolean
}

export type Web3WalletPermission = {
  parentCapability: string // The name of the method corresponding to the permission
  date?: number // The date the permission was granted, in UNIX epoch time
}
