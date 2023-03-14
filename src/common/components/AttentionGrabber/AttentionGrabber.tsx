import { useCallback, useEffect, useMemo } from 'react'

import { useTranslation } from '@common/config/localization'
import useRequests from '@common/hooks/useRequests'
import useToast from '@common/hooks/useToast'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'

const stickyIds: number[] = []

const AttentionGrabber = ({ children }: any) => {
  const { addToast, removeToast } = useToast()
  const { t } = useTranslation()
  const { authStatus } = useAuth()
  const { eligibleRequests, sendTxnState, setSendTxnState } = useRequests()
  const removeStickyToasts = useCallback(
    () => stickyIds.forEach((id) => removeToast(id)),
    [removeToast]
  )
  const isRouteWallet = useMemo(() => null, [])

  useEffect(() => {
    if (eligibleRequests.length && authStatus === AUTH_STATUS.AUTHENTICATED) {
      if (sendTxnState.showing) removeStickyToasts()
      else {
        stickyIds.push(
          addToast(t('Transactions waiting to be signed') as string, {
            sticky: true,
            badge: eligibleRequests.length,
            onClick: () => setSendTxnState({ showing: true })
          })
        )
      }
    } else {
      removeStickyToasts()
    }
  }, [removeStickyToasts, eligibleRequests, sendTxnState, addToast, removeToast, isRouteWallet])

  return children
}

export default AttentionGrabber
