import { useContext } from 'react'

import { ExtensionApprovalContext } from '@common/contexts/extensionApprovalContext'

export default function useExtensionApproval() {
  const context = useContext(ExtensionApprovalContext)

  if (!context) {
    throw new Error('useExtensionApproval must be used within an ExtensionApprovalContext')
  }

  return context
}
