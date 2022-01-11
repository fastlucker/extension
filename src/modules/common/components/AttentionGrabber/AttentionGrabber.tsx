import { useCallback, useEffect, useMemo } from 'react'

import { navigationRef } from '@config/Router/Router'
import useAuth from '@modules/auth/hooks/useAuth'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'

const stickyIds: string[] = []

const AttentionGrabber = ({ children }: any) => {
  const { addToast, removeToast } = useToast()
  const { isAuthenticated } = useAuth()
  const { eligibleRequests, sendTxnState, setSendTxnState, prevSendTxnState } = useRequests()
  const removeStickyToasts = useCallback(
    () => stickyIds.forEach((id) => removeToast(id)),
    [removeToast]
  )
  const isRouteWallet = useMemo(() => null, [])

  useEffect(() => {
    if (eligibleRequests.length && isAuthenticated) {
      if (sendTxnState.showing) removeStickyToasts()
      else {
        stickyIds.push(
          addToast('Transactions waiting to be signed', {
            sticky: true,
            // badge: eligibleRequests.length,
            onClick: () => setSendTxnState({ showing: true })
          })
        )
      }
    } else {
      removeStickyToasts()
    }
  }, [removeStickyToasts, eligibleRequests, sendTxnState, addToast, removeToast, isRouteWallet])

  useEffect(() => {
    if (sendTxnState.showing && !prevSendTxnState.showing) {
      navigationRef.navigate('pending-transactions')
    }
  }, [sendTxnState?.showing, prevSendTxnState?.showing])

  return children
}

export default AttentionGrabber
