import React, { useCallback, useEffect, useRef } from 'react'

import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useBackgroundService from '@web/hooks/useBackgroundService'

const useAccountPicker = () => {
  const { goToNextRoute } = useOnboardingNavigation()
  const shouldResetAccountsSelectionOnUnmount = useRef(true)
  const { dispatch } = useBackgroundService()

  const setPage = React.useCallback(
    (page = 1) => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_SET_PAGE', params: { page } })
    },
    [dispatch]
  )

  const onImportReady = useCallback(() => {
    shouldResetAccountsSelectionOnUnmount.current = false
    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_ADD_ACCOUNTS' })
    goToNextRoute(WEB_ROUTES.accountPersonalize)
  }, [goToNextRoute, dispatch])

  useEffect(() => {
    return () => {
      if (shouldResetAccountsSelectionOnUnmount.current) {
        dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_RESET_ACCOUNTS_SELECTION' })
      }
    }
  }, [dispatch])

  return { setPage, onImportReady }
}

export default useAccountPicker
