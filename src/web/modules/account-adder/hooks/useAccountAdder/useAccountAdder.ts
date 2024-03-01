import React, { useCallback, useEffect } from 'react'

import { KeyIterator } from '@ambire-common/interfaces/keyIterator'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import { STEPPER_FLOWS } from '@common/modules/auth/contexts/stepperContext/stepperContext'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { getDefaultAccountPreferences } from '@web/modules/account-personalize/libs/defaults'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {
  keyType: KeyIterator['type']
  keySubType: KeyIterator['subType']
}

const useAccountAdder = ({ keyType, keySubType }: Props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { createTask } = useTaskQueue()
  const { dispatch, dispatchAsync } = useBackgroundService()
  const { addToast } = useToast()
  const accountAdderState = useAccountAdderControllerState()
  const mainControllerState = useMainControllerState()

  const setPage: any = React.useCallback(
    (page = 1) => {
      createTask(() =>
        dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE', params: { page } })
      )
    },
    [dispatch, createTask]
  )

  // TODO: Implement
  useEffect(() => {
    const step: keyof typeof STEPPER_FLOWS = keySubType || 'hw'

    updateStepperState(WEB_ROUTES.accountAdder, step)
  }, [keySubType, updateStepperState])

  // TODO: Remove
  // useEffect(() => {
  //   if (!mainControllerState.isReady) return
  //   // if (accountAdderState.isInitialized) return

  //   debugger

  //   const init: any = {
  //     internal: () => {
  //       if (!privKeyOrSeed) return

  //       dispatch({
  //         type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
  //         params: { privKeyOrSeed, keyTypeInternalSubtype }
  //       })
  //     },
  //     trezor: () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR' }),
  //     ledger: async () => {
  //       // Ensures account adder is initialized with unlocked key iterator
  //       await createTask(() => dispatchAsync({ type: 'LEDGER_CONTROLLER_UNLOCK' }))

  //       dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER' })
  //     },
  //     lattice: () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE' })
  //   }

  //   init[keyType]()
  // }, [
  //   createTask,
  //   dispatch,
  //   dispatchAsync,
  //   mainControllerState.isReady,
  //   privKeyOrSeed,
  //   keyType,
  //   keyTypeInternalSubtype
  // ])

  // TODO: Move to the background
  // useEffect(() => {
  //   if (!accountAdderState.isInitialized) return

  //   // TODO: Move this in the background process!
  //   setPage()
  // }, [accountAdderState.isInitialized, setPage])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET' })
    }
  }, [dispatch])

  // TODO: Implement
  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      hasAccountsToImport
        ? navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/', {
            state: {
              accounts: accountAdderState.readyToAddAccounts,
              keyType,
              keyTypeInternalSubtype: keySubType
            }
          })
        : navigate('/', { state: { openOnboardingCompleted: true } })
    },
    [navigate, accountAdderState, keyType, keySubType]
  )

  useEffect(() => {
    if (
      mainControllerState.status === 'SUCCESS' &&
      mainControllerState.latestMethodCall === 'onAccountAdderSuccess'
    ) {
      completeStep()
    }
  }, [completeStep, mainControllerState.status, mainControllerState.latestMethodCall])

  const onImportReady = useCallback(() => {
    if (!accountAdderState.selectedAccounts.length) return completeStep(false)

    // TODO: Move to background
    const keyTypeInternalSubtype = 'seed'
    const readyToAddAccountPreferences = getDefaultAccountPreferences(
      accountAdderState.selectedAccounts.map(({ account }) => account),
      mainControllerState.accounts,
      keyType,
      keyTypeInternalSubtype
    )

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    dispatch({
      type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
      params: {
        selectedAccounts: accountAdderState.selectedAccounts,
        readyToAddAccountPreferences,
        readyToAddKeys,
        readyToAddKeyPreferences
      }
    })
  }, [
    accountAdderState.selectedAccounts,
    accountAdderState.hdPathTemplate,
    completeStep,
    keyType,
    mainControllerState.accounts,
    dispatch,
    addToast
  ])

  return { setPage, onImportReady }
}

export default useAccountAdder
