/* eslint-disable @typescript-eslint/no-loop-func */
import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'
/* eslint-disable no-await-in-loop */
import React, { useEffect, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import AccountsList from '@web/modules/account-adder/components/AccountsList'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {}

const LedgerManager: React.FC<Props> = (props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()

  const [state, setState] = useState<AccountAdderController>({} as AccountAdderController)
  const { createTask } = useTaskQueue()

  const { mainCtrl, ledgerCtrl } = useBackgroundService()
  console.log('state', state)
  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const setPage: any = React.useCallback(async () => {
    async function unlockAddresses() {
      let i = (state.page - 1) * state.pageSize
      for (
        i = (state.page - 1) * state.pageSize;
        i <= (state.page - 1) * state.pageSize + state.pageSize - 1;

      ) {
        const path = await createTask(() => ledgerCtrl.getPathForIndex(i))
        await createTask(() => ledgerCtrl.unlock(path))
        i++
      }
    }

    try {
      await unlockAddresses()

      createTask(() =>
        mainCtrl.accountAdderSetPage({
          page: state?.page
        })
      )
    } catch (e: any) {
      console.error(e.message)
    }
  }, [ledgerCtrl, mainCtrl, createTask, state.page, state.pageSize])

  useEffect(() => {
    mainCtrl.accountAdderInit(
      {
        preselectedAccounts: []
      },
      'Ledger'
    )
  }, [mainCtrl])

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

  return (
    <AccountsList
      accounts={[].map((key, i) => ({
        address: key,
        index: state.page + i + 1
      }))}
      loading={state.accountsLoading}
      onImportReady={onImportReady}
      {...props}
    />
  )
}

export default React.memo(LedgerManager)
