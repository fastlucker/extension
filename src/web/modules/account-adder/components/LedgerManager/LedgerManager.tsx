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
import useAccountsPagination from '@web/modules/account-adder/hooks/useAccountsPagination'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {}

const LedgerManager: React.FC<Props> = (props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const [loading, setLoading] = React.useState(true)
  const [state, setState] = useState<AccountAdderController>({} as AccountAdderController)
  const { createTask } = useTaskQueue()
  const { page, pageStartIndex, pageEndIndex } = useAccountsPagination()
  const { mainCtrl, ledgerCtrl } = useBackgroundService()
  console.log('state', state)
  const onImportReady = () => {
    updateStepperState(2, 'hwAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const setPage: any = React.useCallback(async () => {
    setLoading(true)

    async function unlockAddresses() {
      let i = (state.page - 1) * state.pageSize
      for (
        i = (state.page - 1) * state.pageSize;
        i <= (state.page - 1) * state.pageSize + state.pageSize - 1;

      ) {
        const path = await createTask(() => ledgerCtrl.getPathForIndex(i))
        await createTask(() => ledgerCtrl.unlock(path))
        // console.log('key', key)
        i++
      }
    }

    try {
      await unlockAddresses()
      if (!state.isInitialized) {
        mainCtrl.accountAdderInit(
          {
            preselectedAccounts: []
          },
          'Ledger'
        )
      }

      if (state.isInitialized) {
        createTask(() =>
          mainCtrl.accountAdderSetPage({
            page: state?.page
          })
        )
      }
    } catch (e: any) {
      console.error(e.message)
    }
  }, [ledgerCtrl, mainCtrl, createTask, state])

  useEffect(() => {
    const getState = async () => {
      const accountAdderInitialState = await mainCtrl.accountAdderGetState()
      setState(accountAdderInitialState)
    }

    getState()
    const onUpdate = async () => {
      getState()
    }

    eventBus.addEventListener('accountAdder', onUpdate)

    return () => {
      eventBus.removeEventListener('accountAdder', onUpdate)
    }
  }, [mainCtrl])

  useEffect(() => {
    setPage()
  }, [])

  return (
    <AccountsList
      accounts={[].map((key, i) => ({
        address: key,
        index: pageStartIndex + i + 1
      }))}
      loading={loading}
      onImportReady={onImportReady}
      {...props}
    />
  )
}

export default React.memo(LedgerManager)
