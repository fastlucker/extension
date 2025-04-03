import React, { useCallback } from 'react'

import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useBackgroundService from '@web/hooks/useBackgroundService'

const useAccountPicker = () => {
  const { goToNextRoute } = useOnboardingNavigation()

  const { dispatch } = useBackgroundService()

  const setPage = React.useCallback(
    (page = 1) => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_SET_PAGE', params: { page } })
    },
    [dispatch]
  )

  const onImportReady = useCallback(() => {
    goToNextRoute(WEB_ROUTES.accountPersonalize)
  }, [goToNextRoute])

  return { setPage, onImportReady }
}

export default useAccountPicker
