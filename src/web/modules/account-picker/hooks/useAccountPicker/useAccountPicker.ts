import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useOnboardingNavigation from '@common/modules/auth/hooks/useOnboardingNavigation'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

const useAccountPicker = () => {
  const { goToNextRoute } = useOnboardingNavigation()
  const { pageSize, subType } = useAccountPickerControllerState()
  const shouldResetAccountsSelectionOnUnmount = useRef(true)
  const { dispatch } = useBackgroundService()
  const [isReady, setIsReady] = useState(false)

  const ACCOUNT_PICKER_PAGE_SIZE = useMemo(() => {
    return subType === 'private-key' ? 1 : 5
  }, [subType])

  const setPage = React.useCallback(
    (page = 1) => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_SET_PAGE',
        params: { page, pageSize: ACCOUNT_PICKER_PAGE_SIZE }
      })
    },
    [dispatch, ACCOUNT_PICKER_PAGE_SIZE]
  )

  useEffect(() => {
    setPage(1)
  }, [setPage])

  useEffect(() => {
    if (pageSize === ACCOUNT_PICKER_PAGE_SIZE && !isReady) {
      setIsReady(true)
    }
  }, [pageSize, isReady, ACCOUNT_PICKER_PAGE_SIZE])

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

  return { isReady, setPage, onImportReady }
}

export default useAccountPicker
