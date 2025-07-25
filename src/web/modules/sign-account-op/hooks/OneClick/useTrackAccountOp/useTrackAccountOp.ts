import { useCallback, useEffect, useMemo } from 'react'

import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'
import { AccountOpStatus } from '@ambire-common/libs/accountOp/types'
import useBackgroundService from '@web/hooks/useBackgroundService'

type Props = {
  address?: string
  chainId?: bigint
  sessionId: string
  submittedAccountOp?: SubmittedAccountOp | null
  navigateOut: () => void
}

const useTrackAccountOp = ({
  address,
  chainId,
  sessionId,
  submittedAccountOp,
  navigateOut
}: Props) => {
  const { dispatch } = useBackgroundService()

  const sessionHandler = useMemo(() => {
    return {
      initSession: () => {
        if (!address || !chainId) return

        dispatch({
          type: 'MAIN_CONTROLLER_ACTIVITY_SET_ACC_OPS_FILTERS',
          params: {
            sessionId,
            filters: {
              account: address,
              chainId
            },
            pagination: {
              itemsPerPage: 10,
              fromPage: 0
            }
          }
        })
      },
      killSession: () => {
        dispatch({
          type: 'MAIN_CONTROLLER_ACTIVITY_RESET_ACC_OPS_FILTERS',
          params: { sessionId }
        })
      }
    }
  }, [address, chainId, dispatch, sessionId])

  const onPrimaryButtonPress = useCallback(() => {
    // If the user navigates out of this screen while the account op is
    // confirmed, we hide the banner from the dashboard. There is no point in showing it
    // as the user has already seen the result of the transfer.
    if (
      submittedAccountOp &&
      submittedAccountOp?.status !== AccountOpStatus.Pending &&
      submittedAccountOp?.status !== AccountOpStatus.BroadcastedButNotConfirmed &&
      submittedAccountOp?.status !== AccountOpStatus.Rejected
    ) {
      // Hide the activity banner.
      // navigateOut is called in a useEffect once the banner is hidden.
      dispatch({
        type: 'ACTIVITY_CONTROLLER_HIDE_BANNER',
        params: {
          ...submittedAccountOp,
          addr: submittedAccountOp.accountAddr
        }
      })
    } else {
      navigateOut()
    }
  }, [dispatch, navigateOut, submittedAccountOp])

  useEffect(() => {
    // Navigate out of the screen after the banner is removed. Otherwise the banner
    // flashes for a split second after the navigation.
    if (submittedAccountOp?.flags && submittedAccountOp.flags.hideActivityBanner) {
      navigateOut()
    }
  }, [navigateOut, submittedAccountOp?.flags])

  return {
    sessionHandler,
    onPrimaryButtonPress
  }
}

export default useTrackAccountOp
