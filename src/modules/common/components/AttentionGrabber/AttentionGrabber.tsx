import { useCallback, useEffect, useMemo } from 'react'

import { useTranslation } from '@config/localization'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'

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
