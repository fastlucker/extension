// Used for handling approval requests for the extension

import { useCallback, useEffect } from 'react'

import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import { getUiType } from '@web/utils/uiType'

import { UseApprovalReturnType } from './types'

const useApproval = (): UseApprovalReturnType => {
  const { extensionWallet } = useExtensionWallet()

  const getApproval: UseApprovalReturnType['getApproval'] = useCallback(
    () => extensionWallet.getApproval(),
    [extensionWallet]
  )

  const resolveApproval = useCallback<UseApprovalReturnType['resolveApproval']>(
    async (data = undefined, stay = false, forceReject = false, approvalId = undefined) => {
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
    },
    [extensionWallet, getApproval]
  )

  const rejectApproval = useCallback<UseApprovalReturnType['rejectApproval']>(
    async (err = undefined, stay = false, isInternal = false) => {
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
