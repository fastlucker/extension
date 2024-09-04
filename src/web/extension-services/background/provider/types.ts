import { Session } from '@ambire-common/classes/session'
import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'

export type ProviderRequest<TMethod = string> = {
  method: TMethod
  params?: any
  session: Session
  origin: string
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
  submittedAccountOp?: SubmittedAccountOp
}

export type Web3WalletPermission = {
  parentCapability: string // The name of the method corresponding to the permission
  date?: number // The date the permission was granted, in UNIX epoch time
}
