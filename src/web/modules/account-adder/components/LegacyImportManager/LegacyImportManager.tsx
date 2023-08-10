/* eslint-disable react/destructuring-assignment */

import React, { useCallback, useEffect, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

import { getDefaultSelectedAccount } from '../../helpers/account'

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
  const [sessionStarted, setSessionStarted] = useState(false)

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

  const goToNextStep = useCallback(() => {
    updateStepperState(1, 'legacyAuth')

    shouldCreateEmailVault
      ? navigate(WEB_ROUTES.createEmailVault, {
          state: {
            hideStepper: true,
            hideFormTitle: true
          }
        })
      : navigate(WEB_ROUTES.createKeyStore)
  }, [updateStepperState, shouldCreateEmailVault, navigate])

  useEffect(() => {
    if (accountAdderState.addAccountsStatus.type === 'ERROR') {
      // TODO: display error toast instead
      // eslint-disable-next-line no-alert
      alert(accountAdderState.addAccountsStatus.message)
    }

    if (accountAdderState.addAccountsStatus.type === 'SUCCESS') {
      const defaultSelectedAccount = getDefaultSelectedAccount(accountAdderState.readyToAddAccounts)
      if (!defaultSelectedAccount) {
        // TODO: display error toast instead
        // eslint-disable-next-line no-alert
        alert(
          'Failed to select default account. Please try to start the process of selecting accounts again. If the problem persist, please contact support.'
        )
        return
      }

      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: defaultSelectedAccount.addr }
      })
      goToNextStep()
    }
  }, [
    accountAdderState.isInitialized,
    accountAdderState.addAccountsStatus.type,
    accountAdderState.addAccountsStatus.message,
    updateStepperState,
    shouldCreateEmailVault,
    navigate,
    dispatch,
    accountAdderState.readyToAddAccounts,
    goToNextStep
  ])

  useEffect(() => {
    if (sessionStarted) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
      params: {
        preselectedAccounts: mainControllerState.accounts,
        privKeyOrSeed: props.privKeyOrSeed
      }
    })
    setSessionStarted(true)
  }, [
    dispatch,
    props.privKeyOrSeed,
    mainControllerState.accounts,
    accountAdderState.isInitialized,
    setPage,
    sessionStarted
  ])

  useEffect(() => {
    ;(async () => {
      if (!accountAdderState.isInitialized) return
      setPage()
    })()
  }, [accountAdderState.isInitialized, setPage])

  const onImportReady = useCallback(() => {
    if (accountAdderState.selectedAccounts.length) {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
        params: { accounts: accountAdderState.selectedAccounts }
      })
      return
    }

    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET'
    })

    goToNextStep()
  }, [accountAdderState.selectedAccounts, dispatch, goToNextStep])

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
