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

  const { mainCtrl, ledgerCtrl } = useBackgroundService()
  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const setPage: any = React.useCallback(
    async (page = state.page) => {
      try {
        createTask(() =>
          mainCtrl.accountAdderSetPage({
            page
          })
        )
      } catch (e: any) {
        console.error(e.message)
      }
    },
    [mainCtrl, createTask, state.page]
  )

  useEffect(() => {
    ;(async () => {
      // Ensures account adder is initialized with unlocked key iterator
      await createTask(() => ledgerCtrl.unlock())
      mainCtrl.accountAdderInit(
        {
          preselectedAccounts: []
        },
        'Ledger'
      )
    })()
  }, [mainCtrl, createTask, ledgerCtrl])

  useEffect(() => {
    const setAccountAdderState = async () => {
      const accountAdderInitialState = await mainCtrl.accountAdderGetState()
      setState(accountAdderInitialState)
    }

    const onUpdate = async () => {
      setAccountAdderState()
    }

    eventBus.addEventListener('accountAdder', onUpdate)

    return () => {
      eventBus.removeEventListener('accountAdder', onUpdate)
    }
  }, [mainCtrl])

  useEffect(() => {
    ;(async () => {
      if (!state.isInitialized) return
      setPage()
    })()
  }, [state.isInitialized, state.page, setPage])

  if (!Object.keys(state).length) {
    return
  }
  return (
    <AccountsOnPageList state={state} onImportReady={onImportReady} setPage={setPage} {...props} />
  )
}

export default React.memo(LedgerManager)
