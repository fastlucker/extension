import { useContext } from 'react'

import { PermissionContext } from '@mobile/modules/web3/contexts/permissionContext'

export default function usePermission() {
  const context = useContext(PermissionContext)

  if (!context) {
    throw new Error('usePermission must be used within an PermissionProvider')
  }

  return context
}
