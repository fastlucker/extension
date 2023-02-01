// Used for handling approval requests for the extension (not needed for mobile)

import { UseApprovalReturnType } from './types'

const useApproval = (): UseApprovalReturnType => {
  const getApproval = () => Promise.resolve(null)
  const resolveApproval = () => Promise.resolve()
  const rejectApproval = () => Promise.resolve()

  return {
    getApproval,
    resolveApproval,
    rejectApproval
  }
}

export default useApproval
