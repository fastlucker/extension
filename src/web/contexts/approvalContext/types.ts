import { isExtension } from '@web/constants/browserapi'
import { Approval } from '@web/extension-services/background/controllers/notification'

export const APPROVAL_REQUESTS_STORAGE_KEY = isExtension
  ? 'ambire_extension_state'
  : 'approval_requests_state'

export type UseExtensionApprovalReturnType = {
  approval: Approval | null
  hasCheckedForApprovalInitially: boolean
  getApproval: () => Promise<Approval | null>
  resolveApproval: (data: any) => void
  rejectApproval: (err: any) => void
  rejectAllApprovals?: () => void
}
