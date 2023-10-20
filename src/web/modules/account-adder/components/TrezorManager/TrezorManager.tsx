/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-await-in-loop */
import React, { useCallback, useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import { getDefaultSelectedAccount } from '@web/modules/account-adder/helpers/account'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

const TrezorManager: React.FC<{}> = (props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { createTask } = useTaskQueue()
  const { dispatch } = useBackgroundService()
  const accountAdderState = useAccountAdderControllerState()
  const mainControllerState = useMainControllerState()
  const keystoreState = useKeystoreControllerState()

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
    updateStepperState(WEB_ROUTES.accountAdder, 'hw')
  }, [updateStepperState])

  useEffect(() => {
    if (!mainControllerState.isReady) return
    if (accountAdderState.isInitialized) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR',
      params: {}
    })
  }, [accountAdderState.isInitialized, dispatch, mainControllerState.isReady])

  useEffect(() => {
    if (!accountAdderState.isInitialized) return

    setPage()
  }, [accountAdderState.isInitialized, setPage])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET' })
    }
  }, [dispatch])

  useEffect(() => {
    if (accountAdderState.addAccountsStatus === 'SUCCESS') {
      const defaultSelectedAccount = getDefaultSelectedAccount(accountAdderState.readyToAddAccounts)
      if (!defaultSelectedAccount) {
        // TODO: display error toast instead
        // eslint-disable-next-line no-alert
        alert(
          'Failed to select default account. Please try to start the process of selecting accounts again. If the problem persists, please contact support.'
        )
        return
      }

      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: defaultSelectedAccount.addr }
      })

      dispatch({
        type: 'KEYSTORE_CONTROLLER_ADD_KEYS_EXTERNALLY_STORED'
      })
    }
  })

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/')
    },
    [navigate]
  )

  useEffect(() => {
    if (
      keystoreState.status === 'DONE' &&
      keystoreState.latestMethodCall === 'addKeysExternallyStored'
    ) {
      completeStep()
    }
  }, [completeStep, keystoreState])

  const onImportReady = useCallback(() => {
    if (accountAdderState.selectedAccounts.length) {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
        params: { accounts: accountAdderState.selectedAccounts }
      })
      return
    }

    completeStep(false)
  }, [accountAdderState.selectedAccounts, dispatch, completeStep])

  return (
    <AccountsOnPageList
      isSubmitting={accountAdderState.addAccountsStatus === 'LOADING'}
      state={accountAdderState}
      onImportReady={onImportReady}
      setPage={setPage}
      {...props}
    />
  )
}

export default React.memo(TrezorManager)
