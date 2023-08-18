/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {}

const LedgerManager = (props: Props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { createTask } = useTaskQueue()
  const { dispatch, dispatchAsync } = useBackgroundService()
  const state = useAccountAdderControllerState()

  const onImportReady = () => {
    updateStepperState(2, 'hw')
    navigate(WEB_ROUTES.accountPersonalize)
  }

  const setPage: any = React.useCallback(
    async (page = 1) => {
      try {
        createTask(() =>
          dispatch({
            type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE',
            params: { page }
          })
        )
      } catch (e: any) {
        console.error(e.message)
      }
    },
    [dispatch, createTask]
  )

  useEffect(() => {
    ;(async () => {
      // Ensures account adder is initialized with unlocked key iterator
      await createTask(() => dispatchAsync({ type: 'LEDGER_CONTROLLER_UNLOCK' }))
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER',
        params: {}
      })
    })()
  }, [dispatch, dispatchAsync, createTask])

  useEffect(() => {
    ;(async () => {
      if (!state.isInitialized) return
      setPage()
    })()
  }, [state.isInitialized, setPage])

  if (!Object.keys(state).length) {
    return
  }
  return (
    <AccountsOnPageList state={state} onImportReady={onImportReady} setPage={setPage} {...props} />
  )
}

export default React.memo(LedgerManager)
