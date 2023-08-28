import { DappNotificationRequest } from 'ambire-common/src/interfaces/userRequest'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { delayPromise } from '@common/utils/promises'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import { getUiType } from '@web/utils/uiType'

import { UseExtensionApprovalReturnType } from './types'

// In the cases when the dApp requests multiple approvals, but waits the
// response from the prev one to request the next one. For example
// this happens with https://polygonscan.com/ and https://bscscan.com/
// when you try to "Add Token to Web3 Wallet".
const DELAY_BEFORE_REQUESTING_NEXT_REQUEST_IF_ANY = 850

const DappNotificationRequestContext = createContext<UseExtensionApprovalReturnType>({
  approval: null,
  hasCheckedForApprovalInitially: false,
  getApproval: () => Promise.resolve(null),
  resolveApproval: () => Promise.resolve(),
  rejectApproval: () => Promise.resolve()
})

const DappNotificationRequestProvider: React.FC<any> = ({ children }) => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { authStatus } = useAuth()
  const keystoreState = useKeystoreControllerState()
  const { navigate } = useNavigation()
  const { dispatch, dispatchAsync } = useBackgroundService()
  const [approval, setApproval] = useState<DappNotificationRequest | null>(null)
  const [hasCheckedForApprovalInitially, setHasCheckedForApprovalInitially] = useState(false)

  const getApproval: UseExtensionApprovalReturnType['getApproval'] = useCallback(
    () => dispatchAsync({ type: 'NOTIFICATION_CONTROLLER_GET_APPROVAL' }),
    [dispatchAsync]
  )

  const resolveApproval = useCallback<UseExtensionApprovalReturnType['resolveApproval']>(
    async (data) => {
      if (!approval) {
        return addToast(
          t(
            'Missing approval request from the dApp. Please close this window and trigger the action again from the dApp.'
          ),
          { error: true }
        )
      }

      await dispatch({
        type: 'RESOLVE_NOTIFICATION_REQUEST',
        params: { data, id: approval.id }
      })

      await delayPromise(DELAY_BEFORE_REQUESTING_NEXT_REQUEST_IF_ANY)

      const nextApproval = await getApproval()
      setApproval(nextApproval)

      // Navigate to the main route after the approval is resolved, which
      // triggers the logic that determines where user should go next.
      setTimeout(() => navigate('/'))
    },
    [addToast, approval, dispatch, getApproval, t, navigate]
  )

  const rejectApproval = useCallback<UseExtensionApprovalReturnType['rejectApproval']>(
    async (error) => {
      if (!approval) {
        return addToast(
          t(
            'Missing approval request from the dApp. Please close this window and trigger the action again from the dApp.'
          ),
          { error: true }
        )
      }

      await dispatch({
        type: 'REJECT_NOTIFICATION_REQUEST',
        params: { error, id: approval.id }
      })

      await delayPromise(DELAY_BEFORE_REQUESTING_NEXT_REQUEST_IF_ANY)

      const nextApproval = await getApproval()
      setApproval(nextApproval)

      navigate('/')
    },
    [approval, dispatch, getApproval, addToast, t, navigate]
  )

  // If the approval is from type UserRequest add a new request to the userRequests in mainCtrl
  // useSetUserRequest({ approval, resolveApproval, rejectApproval })

  useEffect(() => {
    ;(async () => {
      if (getUiType().isNotification) {
        const currentApproval = await getApproval()
        setApproval(currentApproval)
      }

      setHasCheckedForApprovalInitially(true)
    })()
  }, [
    getApproval,
    // Re-get the approval since when the vault is locked and then unlocked -
    // the approval data changes. Use case: extension is locked, user is
    // authenticated, dApp requests something, user unlocks the extension.
    keystoreState.isUnlocked,
    // Re-get the approval since when there are no accounts and then - the user
    // adds an account (and therefore - authenticates) - the approval data changes
    authStatus
  ])

  useEffect(() => {
    if (!getUiType().isNotification) return

    // Be aware, that this window listener might not get trigger on all
    // browsers. The `rejectApproval` gets triggered on Chrome, even  without
    // this listener. But it might be needed for other browsers or use-cases.
    window.addEventListener('beforeunload', rejectApproval)

    return () => window.removeEventListener('beforeunload', rejectApproval)
  }, [rejectApproval])

  return (
    <DappNotificationRequestContext.Provider
      value={useMemo(
        () => ({
          approval,
          hasCheckedForApprovalInitially,
          getApproval,
          resolveApproval,
          rejectApproval
        }),
        [approval, hasCheckedForApprovalInitially, getApproval, resolveApproval, rejectApproval]
      )}
    >
      {children}
    </DappNotificationRequestContext.Provider>
  )
}

export { DappNotificationRequestProvider, DappNotificationRequestContext }
