// useShowView.ts
import { useEffect, useMemo, useState } from 'react'

import useToast from '@common/hooks/useToast'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

const WAIT_THRESHOLD = 5000

interface ReturnProps {
  showView: boolean
}

export const useShowDashboard = (): ReturnProps => {
  const { addToast } = useToast()
  const { accountPortfolio, startedLoading } = usePortfolioControllerState()

  const [timeoutShowViewReached, setTimeoutShowViewReached] = useState(false)

  // Flag to check if loading already is taking too long based on the controller state
  const loadingExceededThreshold = useMemo(() => {
    return startedLoading ? Date.now() - startedLoading > WAIT_THRESHOLD : false
  }, [startedLoading])

  // Safeguard (fallback for the `loadingExceededThreshold` flag) to still show
  // partial results if loading takes too long but the portfolio controller
  // state is not updated (could happen if user looses connectivity).
  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextShowView = loadingExceededThreshold || !!accountPortfolio?.isAllReady

      if (!nextShowView) {
        setTimeoutShowViewReached(true)
        addToast(
          'Updating portfolio is taking longer than expected, showing partial results now...',
          { type: 'warning' }
        )
      }
    }, WAIT_THRESHOLD)

    return () => clearTimeout(timeout)
  }, [loadingExceededThreshold, accountPortfolio?.isAllReady, addToast])

  const showView =
    timeoutShowViewReached || loadingExceededThreshold || !!accountPortfolio?.isAllReady

  return { showView }
}
