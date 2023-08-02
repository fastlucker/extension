/* eslint-disable @typescript-eslint/no-loop-func */
import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {}

const LedgerManager: React.FC<Props> = (props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()

  const [state, setState] = useState<AccountAdderController>({} as AccountAdderController)
  const { createTask } = useTaskQueue()

  const { dispatch, dispatchAsync } = useBackgroundService()
  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
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
        params: { preselectedAccounts: [] }
      })
    })()
  }, [dispatch, dispatchAsync, createTask])

  useEffect(() => {
    const setAccountAdderState = async () => {
      const accountAdderInitialState = await dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_STATE'
      })
      setState(accountAdderInitialState)
    }

    const onUpdate = async () => {
      setAccountAdderState()
    }

    eventBus.addEventListener('accountAdder', onUpdate)

    return () => {
      eventBus.removeEventListener('accountAdder', onUpdate)
    }
  }, [dispatch])

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
