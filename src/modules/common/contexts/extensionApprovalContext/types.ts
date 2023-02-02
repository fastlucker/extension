import { Approval } from '@web/background/services/notification'

export type UseExtensionApprovalReturnType = {
  approval: Approval | null
  requests: any[] | null
  hasCheckedForApprovalInitially: boolean
  getApproval: () => Promise<Approval | null>
  resolveApproval: (data: any, stay?: boolean, forceReject?: boolean, approvalId?: string) => void
  rejectApproval: (err: any, stay?: boolean, isInternal?: boolean) => void
  resolveMany: (ids: any, resolution: any) => any
}
