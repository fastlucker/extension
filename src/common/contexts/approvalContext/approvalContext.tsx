/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { createContext, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import { delayPromise } from '@common/utils/promises'
import useNotification from '@mobile/modules/web3/hooks/useNotification'

import { UseExtensionApprovalReturnType } from './types'
import useSignApproval from './useSignApproval'

// In the cases when the dApp requests multiple approvals, but waits the
// response from the prev one to request the next one. For example
// this happens with https://polygonscan.com/ and https://bscscan.com/
// when you try to "Add Token to Web3 Wallet".
const MAGIC_DELAY_THAT_FIXES_CONCURRENT_DAPP_APPROVAL_REQUESTS = 850

const ApprovalContext = createContext<UseExtensionApprovalReturnType>({
  approval: null,
  requests: [],
  hasCheckedForApprovalInitially: false,
  getApproval: () => Promise.resolve(null),
  resolveApproval: () => Promise.resolve(),
  rejectApproval: () => Promise.resolve(),
  resolveMany: () => {},
  rejectAllApprovals: () => {}
})

const ApprovalProvider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const { requestNotificationServiceMethod, approval, setApproval } = useNotification()

  const getApproval: UseExtensionApprovalReturnType['getApproval'] = useCallback(
    () =>
      requestNotificationServiceMethod({
        method: 'getApproval'
      }),
    [requestNotificationServiceMethod]
  )

  const resolveApproval = useCallback<UseExtensionApprovalReturnType['resolveApproval']>(
    async (data = undefined, stay = false, forceReject = false, approvalId = undefined) => {
      if (!approval) {
        return addToast(
          t(
            'Missing approval request from the dApp. Please close this window and trigger the action again from the dApp.'
          ),
          { error: true }
        )
      }

      await requestNotificationServiceMethod({
        method: 'resolveApproval',
        props: { data, forceReject, approvalId }
      })

      await delayPromise(MAGIC_DELAY_THAT_FIXES_CONCURRENT_DAPP_APPROVAL_REQUESTS)

      const nextApproval = await getApproval()
      setApproval(nextApproval)

      if (stay) {
        return
      }

      // Navigate to the main route after the approval is resolved, which
      // triggers the logic that determines where user should go next.
      setTimeout(() => navigate('/'))
    },
    [requestNotificationServiceMethod, addToast, approval, getApproval, t, navigate, setApproval]
  )

  const rejectApproval = useCallback<UseExtensionApprovalReturnType['rejectApproval']>(
    async (err = undefined, stay = false, isInternal = false) => {
      if (!approval) {
        return addToast(
          t(
            'Missing approval request from the dApp. Please close this window and trigger the action again from the dApp.'
          ),
          { error: true }
        )
      }

      await requestNotificationServiceMethod({
        method: 'rejectApproval',
        props: { err, stay, isInternal }
      })

      await delayPromise(MAGIC_DELAY_THAT_FIXES_CONCURRENT_DAPP_APPROVAL_REQUESTS)

      const nextApproval = await getApproval()
      setApproval(nextApproval)
    },
    [requestNotificationServiceMethod, approval, getApproval, addToast, t, setApproval]
  )

  const { requests, resolveMany, setRequests } = useSignApproval({
    approval,
    resolveApproval,
    rejectApproval
  })

  const rejectAllApprovals = useCallback(async () => {
    await requestNotificationServiceMethod({
      method: 'rejectAllApprovals'
    })

    if (approval?.data?.approvalComponent === 'SendTransaction') {
      // Removes all cached signing requests (otherwise they will be shown again
      // in the browser extension UI, when it gets opened by the user)
      setRequests([])
    }
  }, [requestNotificationServiceMethod, setRequests, approval])

  return (
    <ApprovalContext.Provider
      value={useMemo(
        () => ({
          approval,
          requests,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany,
          rejectAllApprovals
        }),
        [
          approval,
          requests,
          getApproval,
          resolveApproval,
          rejectApproval,
          resolveMany,
          rejectAllApprovals
        ]
      )}
    >
      {children}
    </ApprovalContext.Provider>
  )
}

export { ApprovalProvider, ApprovalContext }
