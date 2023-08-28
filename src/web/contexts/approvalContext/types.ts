import { DappNotificationRequest } from 'ambire-common/src/interfaces/userRequest'

import { isExtension } from '@web/constants/browserapi'

export const APPROVAL_REQUESTS_STORAGE_KEY = isExtension
  ? 'ambire_extension_state'
  : 'approval_requests_state'

export type UseExtensionApprovalReturnType = {
  approval: DappNotificationRequest | null
  hasCheckedForApprovalInitially: boolean
  getApproval: () => Promise<DappNotificationRequest | null>
  resolveApproval: (data: any) => void
  rejectApproval: (err: any) => void
  rejectAllApprovals?: () => void
}
