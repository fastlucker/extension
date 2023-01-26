// Used for handling approval requests for the extension (not needed for mobile)

export const useApproval = () => {
  const getApproval: () => Promise<any> = () => Promise.resolve()

  const resolveApproval = async (
    data?: any,
    stay = false,
    forceReject = false,
    approvalId?: string
  ) => Promise.resolve()

  const rejectApproval = async (err?, stay = false, isInternal = false) => Promise.resolve()

  return {
    getApproval,
    resolveApproval,
    rejectApproval
  }
}
