// useShowView.ts
import { useEffect, useState } from 'react'

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

  // Safeguard to show partial results if loading takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextShowView =
        (startedLoading ? Date.now() - startedLoading > WAIT_THRESHOLD : false) ||
        !!accountPortfolio?.isAllReady

      if (!nextShowView) {
        setTimeoutShowViewReached(true)
        addToast(
          'Updating portfolio is taking longer than expected, showing partial results now...',
          { type: 'warning' }
        )
      }
    }, WAIT_THRESHOLD)

    return () => clearTimeout(timeout)
  }, [accountPortfolio?.isAllReady, addToast, startedLoading])

  const showView =
    timeoutShowViewReached ||
    (startedLoading ? Date.now() - startedLoading > WAIT_THRESHOLD : false) ||
    !!accountPortfolio?.isAllReady

  return { showView }
}
