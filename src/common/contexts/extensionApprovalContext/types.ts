import { Approval } from '@web/extension-services/background/services/notification'

export const BROWSER_EXTENSION_REQUESTS_STORAGE_KEY = 'ambire_extension_state'

export type UseExtensionApprovalReturnType = {
  approval: Approval | null
  requests: any[] | null
  hasCheckedForApprovalInitially: boolean
  getApproval: () => Promise<Approval | null>
  resolveApproval: (data: any, stay?: boolean, forceReject?: boolean, approvalId?: string) => void
  rejectApproval: (err: any, stay?: boolean, isInternal?: boolean) => void
  resolveMany: (ids: any, resolution: any) => any
}
