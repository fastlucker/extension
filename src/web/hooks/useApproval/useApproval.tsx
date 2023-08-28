import { useContext } from 'react'

import { DappNotificationRequestContext } from '@web/contexts/approvalContext'

export default function useApproval() {
  const context = useContext(DappNotificationRequestContext)

  if (!context) {
    throw new Error('useApproval must be used within an ApprovalProvider')
  }

  return context
}
