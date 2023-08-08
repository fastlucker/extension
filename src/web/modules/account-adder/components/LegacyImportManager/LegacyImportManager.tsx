/* eslint-disable react/destructuring-assignment */

import React, { useCallback, useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {
  privKeyOrSeed: string
}

const LegacyImportManager = (props: Props) => {
  const [shouldCreateEmailVault] = React.useState(false)
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { createTask } = useTaskQueue()
  const { dispatch } = useBackgroundService()
  const accountAdderState = useAccountAdderControllerState()
  const mainControllerState = useMainControllerState()

  useEffect(() => {
    ;(async () => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
        params: {
          preselectedAccounts: mainControllerState.accounts,
          privKeyOrSeed: props.privKeyOrSeed
        }
      })
    })()
  }, [dispatch, createTask, props.privKeyOrSeed, mainControllerState.accounts])

  useEffect(() => {
    const isInTheMiddleOfImport = false
    // TODO:const isInTheMiddleOfImport =
    // const isInTheMiddleOfImport =
    //   accountAdderState.addAccountsStatus.type !== 'INITIAL' &&
    //   accountAdderState.selectedAccounts.length === 0

    if (isInTheMiddleOfImport) return

    if (accountAdderState.addAccountsStatus.type === 'ERROR') {
      // TODO: display error toast instead
      // eslint-disable-next-line no-alert
      alert(accountAdderState.addAccountsStatus.message)
    }

    if (accountAdderState.addAccountsStatus.type === 'SUCCESS') {
      // TODO: Select account!

      updateStepperState(1, 'legacyAuth')
      shouldCreateEmailVault
        ? navigate(WEB_ROUTES.createEmailVault, {
            state: {
              hideStepper: true,
              hideFormTitle: true
            }
          })
        : navigate(WEB_ROUTES.createKeyStore)
    }
  }, [
    accountAdderState.addAccountsStatus.type,
    accountAdderState.addAccountsStatus.message,
    updateStepperState,
    shouldCreateEmailVault,
    navigate,
    dispatch,
    accountAdderState.addAccountsStatus,
    accountAdderState.selectedAccounts.length
  ])

  const setPage = useCallback(
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
      if (!accountAdderState.isInitialized) return
      setPage()
    })()
  }, [accountAdderState.isInitialized, setPage])

  const onImportReady = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
      params: { accounts: accountAdderState.selectedAccounts }
    })
  }, [dispatch, accountAdderState.selectedAccounts])

  return (
    <AccountsOnPageList
      isSubmitting={accountAdderState.addAccountsStatus.type === 'PENDING'}
      state={accountAdderState}
      onImportReady={onImportReady}
      setPage={setPage}
      {...props}
    />
  )
}

export default React.memo(LegacyImportManager)
