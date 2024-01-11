import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect, useMemo } from 'react'

import {
  HD_PATH_TEMPLATE_TYPE,
  SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET
} from '@ambire-common/consts/derivation'
import { ReadyToAddKeys } from '@ambire-common/controllers/accountAdder/accountAdder'
import { Key } from '@ambire-common/interfaces/keystore'
import {
  derivePrivateKeyFromAnotherPrivateKey,
  getPrivateKeyFromSeed,
  isValidPrivateKey
} from '@ambire-common/libs/keyIterator/keyIterator'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import {
  getDefaultAccountPreferences,
  getDefaultKeyLabel
} from '@web/modules/account-personalize/libs/defaults'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

interface Props {
  keyType: Key['type']
  keyLabel?: string
  privKeyOrSeed?: string
}

const useAccountAdder = ({ keyType, privKeyOrSeed, keyLabel }: Props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { createTask } = useTaskQueue()
  const { dispatch, dispatchAsync } = useBackgroundService()
  const { addToast } = useToast()
  const accountAdderState = useAccountAdderControllerState()
  const mainControllerState = useMainControllerState()
  const keyTypeInternalSubtype = useMemo(() => {
    if (keyType !== 'internal' || !privKeyOrSeed) return undefined

    return Mnemonic.isValidMnemonic(privKeyOrSeed) ? 'seed' : 'private-key'
  }, [keyType, privKeyOrSeed])

  const setPage: any = React.useCallback(
    (page = 1) => {
      createTask(() =>
        dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_PAGE', params: { page } })
      )
    },
    [dispatch, createTask]
  )

  useEffect(() => {
    const step = keyType === 'internal' ? 'legacy' : 'hw'
    updateStepperState(WEB_ROUTES.accountAdder, step)
  }, [keyType, updateStepperState])

  useEffect(() => {
    if (!mainControllerState.isReady) return
    if (accountAdderState.isInitialized) return

    const init: any = {
      internal: () => {
        if (!privKeyOrSeed) return

        dispatch({
          type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
          params: { privKeyOrSeed }
        })
      },
      trezor: () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_TREZOR' }),
      ledger: async () => {
        // Ensures account adder is initialized with unlocked key iterator
        await createTask(() => dispatchAsync({ type: 'LEDGER_CONTROLLER_UNLOCK' }))

        dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LEDGER' })
      },
      lattice: () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE' })
    }

    init[keyType]()
  }, [
    accountAdderState.isInitialized,
    createTask,
    dispatch,
    dispatchAsync,
    mainControllerState.isReady,
    privKeyOrSeed,
    keyType
  ])

  useEffect(() => {
    if (!accountAdderState.isInitialized) return

    setPage()
  }, [accountAdderState.isInitialized, setPage])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_RESET' })
    }
  }, [dispatch])

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/', {
        state: {
          accounts: accountAdderState.readyToAddAccounts,
          keyType,
          keyTypeInternalSubtype
        }
      })
    },
    [navigate, accountAdderState, keyType, keyTypeInternalSubtype]
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

    const readyToAddKeys: {
      internal: ReadyToAddKeys['internal']
      externalTypeOnly: Key['type']
    } = { internal: [], externalTypeOnly: '' }
    if (keyType === 'internal') {
      try {
        // TODO: throw?
        if (!privKeyOrSeed) throw new Error('No private key or seed provided.')
        if (!accountAdderState.hdPathTemplate)
          throw new Error(
            'No HD path template provided. Please try to start the process of selecting accounts again. If the problem persist, please contact support.'
          )

        const readyToAddInternalKeys = accountAdderState.selectedAccounts.map((acc) => {
          let privateKey = privKeyOrSeed

          // In case it is a seed, the private keys have to be extracted
          if (Mnemonic.isValidMnemonic(privKeyOrSeed)) {
            privateKey = getPrivateKeyFromSeed(
              privKeyOrSeed,
              acc.index,
              // should always be provided, otherwise it would have thrown an error above
              accountAdderState.hdPathTemplate as HD_PATH_TEMPLATE_TYPE
            )
          }

          // Private keys for accounts used as smart account keys should be derived
          const isPrivateKeyThatShouldBeDerived =
            isValidPrivateKey(privKeyOrSeed) &&
            acc.index >= SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET
          if (isPrivateKeyThatShouldBeDerived) {
            privateKey = derivePrivateKeyFromAnotherPrivateKey(privKeyOrSeed)
          }

          return { privateKey }
        })

        readyToAddKeys.internal = readyToAddInternalKeys
      } catch (error: any) {
        console.error(error)

        addToast(
          'The selected accounts got imported, but Ambire failed to retrieve their keys. Please log out of these accounts and try to import them again. Until then, these accounts will be view only. If the problem persists, please contact support.',
          { timeout: 4000, type: 'error' }
        )
      }
    } else {
      readyToAddKeys.externalTypeOnly = keyType
    }

    const readyToAddKeyPreferences = accountAdderState.selectedAccounts.map(
      ({ accountKeyAddr, slot, index }) => ({
        addr: accountKeyAddr,
        type: keyType,
        label: getDefaultKeyLabel(keyType, index, slot, keyLabel)
      })
    )

    const prevAccountsCount = mainControllerState.accounts.length
    const readyToAddAccountPreferences = getDefaultAccountPreferences(
      accountAdderState.selectedAccounts.map(({ account }) => account),
      prevAccountsCount,
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
    mainControllerState.accounts.length,
    dispatch,
    privKeyOrSeed,
    addToast,
    keyLabel,
    keyTypeInternalSubtype
  ])

  return { setPage, onImportReady }
}

export default useAccountAdder
