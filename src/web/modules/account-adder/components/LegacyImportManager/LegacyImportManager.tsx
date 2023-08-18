/* eslint-disable react/destructuring-assignment */

import React, { useCallback, useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'

import { getDefaultSelectedAccount } from '../../helpers/account'

interface Props {
  privKeyOrSeed: string
}

const LegacyImportManager = (props: Props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { dispatch } = useBackgroundService()
  const accountAdderState = useAccountAdderControllerState()
  const mainControllerState = useMainControllerState()

  const setPage = useCallback(
    (page = 1) => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE', params: { page } })
    },
    [dispatch]
  )

  useEffect(() => {
    if (!mainControllerState.isReady) return
    if (accountAdderState.isInitialized) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
      params: {
        privKeyOrSeed: props.privKeyOrSeed
      }
    })
  }, [accountAdderState.isInitialized, dispatch, mainControllerState.isReady, props.privKeyOrSeed])

  useEffect(() => {
    if (!accountAdderState.isInitialized) return

    setPage()
  }, [accountAdderState.isInitialized, setPage])

  const completeStep = useCallback(() => {
    updateStepperState(1, 'legacy')

    navigate(WEB_ROUTES.accountPersonalize)
  }, [navigate, updateStepperState])

  useEffect(() => {
    if (accountAdderState.addAccountsStatus.type === 'ERROR') {
      // TODO: display error toast instead
      // eslint-disable-next-line no-alert
      alert(accountAdderState.addAccountsStatus.message)
      return
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
      completeStep()
    }
  }, [
    accountAdderState.isInitialized,
    accountAdderState.addAccountsStatus.type,
    accountAdderState.addAccountsStatus.message,
    updateStepperState,
    navigate,
    dispatch,
    accountAdderState.readyToAddAccounts,
    completeStep
  ])

  const onImportReady = useCallback(() => {
    if (accountAdderState.selectedAccounts.length) {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
        params: { accounts: accountAdderState.selectedAccounts }
      })
      return
    }

    dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET' })
    completeStep()
  }, [accountAdderState.selectedAccounts, dispatch, completeStep])

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
