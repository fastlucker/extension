import { Approval } from '@mobile/modules/web3/services/webview-background/services/notification'

export const APPROVAL_REQUESTS_STORAGE_KEY = 'approval_requests_state'

export type Web3ContextData = {
  checkHasPermission: (dappURL: string) => boolean
  addPermission: (dappURL: string) => void
  setSelectedDappUrl: React.Dispatch<React.SetStateAction<string>>
  approval: Approval | null
  setApproval: React.Dispatch<React.SetStateAction<Approval | null>>
  setWeb3ViewRef: React.Dispatch<any>
  handleWeb3Request: ({ data }: { data: any }) => any
  requests: any[] | null
  getApproval: () => Promise<Approval | null>
  resolveApproval: (data: any, stay?: boolean, forceReject?: boolean, approvalId?: string) => void
  rejectApproval: (err: any, stay?: boolean, isInternal?: boolean) => void
  resolveMany: (ids: any, resolution: any) => any
  rejectAllApprovals?: () => void
}

export type UseApprovalProps = {
  approval: Approval | null
  setApproval: React.Dispatch<React.SetStateAction<Approval | null>>
  requestNotificationServiceMethod: ({
    method,
    props
  }: {
    method: string
    props?:
      | {
          [key: string]: any
        }
      | undefined
  }) => any
}

export type UseApprovalReturnType = {
  requests: any[] | null
  hasCheckedForApprovalInitially: boolean
  getApproval: () => Promise<Approval | null>
  resolveApproval: (data: any, stay?: boolean, forceReject?: boolean, approvalId?: string) => void
  rejectApproval: (err: any, stay?: boolean, isInternal?: boolean) => void
  resolveMany: (ids: any, resolution: any) => any
  rejectAllApprovals?: () => void
}

export type UseSignApprovalProps = {
  approval: Approval | null
  resolveApproval: (data: any, stay?: boolean, forceReject?: boolean, approvalId?: string) => void
  rejectApproval: (err: any, stay?: boolean, isInternal?: boolean) => void
}
