// Used for handling approval requests for the extension

import { useCallback, useEffect } from 'react'

import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import { Approval } from '@web/background/services/notification'
import { getUiType } from '@web/utils/uiType'

const useApproval = () => {
  const { extensionWallet } = useExtensionWallet()

  const getApproval: () => Promise<Approval> = extensionWallet.getApproval

  const resolveApproval = async (
    data?: any,
    // eslint-disable-next-line default-param-last
    stay = false,
    // eslint-disable-next-line default-param-last
    forceReject = false,
    approvalId?: string
  ) => {
    const approval = await getApproval()

    if (approval) {
      extensionWallet.resolveApproval(data, forceReject, approvalId)
    }
    if (stay) {
      return
    }
    setTimeout(() => {
      // TODO:
      // history.replace('/')
    })
  }

  const rejectApproval = useCallback(
    async (err?: any, stay = false, isInternal = false) => {
      const approval = await getApproval()
      if (approval) {
        await extensionWallet.rejectApproval(err, stay, isInternal)
      }
      if (!stay) {
        // TODO:
        // history.push('/')
      }
    },
    [getApproval, extensionWallet]
  )

  useEffect(() => {
    if (!getUiType().isNotification) {
      return
    }
    window.addEventListener('beforeunload', rejectApproval)

    return () => window.removeEventListener('beforeunload', rejectApproval)
  }, [rejectApproval])

  return {
    getApproval,
    resolveApproval,
    rejectApproval
  }
}

export default useApproval
