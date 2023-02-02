import { createContext } from 'react'

import { UseExtensionApprovalReturnType } from './types'

// This context is needed for the browser extension only. For mobile, fallback to defaults.
const ExtensionApprovalContext = createContext<UseExtensionApprovalReturnType>({
  approval: null,
  hasCheckedForApprovalInitially: false,
  getApproval: () => Promise.resolve(null),
  resolveApproval: () => Promise.resolve(),
  rejectApproval: () => Promise.resolve()
})

const ExtensionApprovalProvider: React.FC<any> = ({ children }) => children

export { ExtensionApprovalProvider, ExtensionApprovalContext }
