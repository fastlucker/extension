import React, { useCallback, useEffect } from 'react'

import usePrevious from '@common/hooks/usePrevious'
import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

const useAccountAdder = () => {
  const { goToPrevRoute, goToNextRoute } = useOnboardingNavigation()
  const { createTask } = useTaskQueue()

  const { dispatch } = useBackgroundService()
  const accountAdderState = useAccountAdderControllerState()
  const prevOnAccountAdderSuccess = usePrevious(accountAdderState.addAccountsStatus)
  const setPage = React.useCallback(
    (page = 1) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      createTask(() =>
        dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE', params: { page } })
      )
    },
    [dispatch, createTask]
  )

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      hasAccountsToImport ? goToPrevRoute() : goToNextRoute()
    },
    [goToPrevRoute, goToNextRoute]
  )

  useEffect(() => {
    if (
      prevOnAccountAdderSuccess === 'LOADING' &&
      accountAdderState.addAccountsStatus === 'SUCCESS'
    ) {
      completeStep()
    }
  }, [prevOnAccountAdderSuccess, accountAdderState.addAccountsStatus, completeStep])

  const onImportReady = useCallback(() => {
    if (!accountAdderState.selectedAccounts.length) return completeStep(false)

    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS' })
  }, [accountAdderState.selectedAccounts, completeStep, dispatch])

  return { setPage, onImportReady }
}

export default useAccountAdder
