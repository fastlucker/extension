import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import { STEPPER_FLOWS } from '@common/modules/auth/contexts/stepperContext/stepperContext'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

import { getDefaultSelectedAccount } from '../../helpers/account'

type Type = 'legacy' | 'ledger' | 'trezor' | 'lattice'

interface Props {
  stepperFlow: keyof typeof STEPPER_FLOWS
  type: Type
  privKeyOrSeed?: string
}

const useAccountAdder = ({ stepperFlow, type, privKeyOrSeed }: Props) => {
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
    updateStepperState(WEB_ROUTES.accountAdder, stepperFlow)
  }, [stepperFlow, updateStepperState])

  useEffect(() => {
    if (!mainControllerState.isReady) return
    if (accountAdderState.isInitialized) return

    switch (type) {
      case 'legacy': {
        if (!privKeyOrSeed) return

        return dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
          params: { privKeyOrSeed }
        })
      }
      case 'trezor':
        return dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR',
          params: {}
        })
      case 'ledger':
        return dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER',
          params: {}
        })
      case 'lattice':
      default:
        // TODO
        return null
    }
  }, [accountAdderState.isInitialized, dispatch, mainControllerState.isReady, privKeyOrSeed, type])

  useEffect(() => {
    if (!accountAdderState.isInitialized) return

    setPage()
  }, [accountAdderState.isInitialized, setPage])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET' })
    }
  }, [dispatch])

  // TODO: Move?
  useEffect(() => {
    if (accountAdderState.addAccountsStatus === 'SUCCESS') {
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

      dispatch({
        type: 'KEYSTORE_CONTROLLER_ADD_KEYS_EXTERNALLY_STORED'
      })
    }
  })

  // TODO: Move
  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/')
    },
    [navigate]
  )

  // TODO: Move
  useEffect(() => {
    if (
      keystoreState.status === 'DONE' &&
      // TODO: variable
      keystoreState.latestMethodCall === 'addKeysExternallyStored'
    ) {
      completeStep()
    }
  }, [completeStep, keystoreState])

  // TODO: Move
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

  return { onImportReady }
}

export default useAccountAdder
