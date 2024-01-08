import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect, useMemo } from 'react'

import {
  HD_PATH_TEMPLATE_TYPE,
  SMART_ACCOUNT_SIGNER_KEY_DERIVATION_OFFSET
} from '@ambire-common/consts/derivation'
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
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { getDefaultKeyLabel } from '@web/modules/account-personalize/libs/defaults'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

import { getDefaultSelectedAccount } from '../../helpers/account'

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
  const keystoreState = useKeystoreControllerState()
  const keyTypeInternalSubtype = useMemo(() => {
    if (keyType !== 'internal' || !privKeyOrSeed) return ''

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

  useEffect(() => {
    // FIXME: Move these connected dispatched actions to the background process
    if (accountAdderState.addAccountsStatus === 'SUCCESS') {
      const defaultSelectedAccount = getDefaultSelectedAccount(accountAdderState.readyToAddAccounts)
      if (!defaultSelectedAccount) {
        addToast(
          'Failed to select default account. Please try to start the process of selecting accounts again. If the problem persist, please contact support.',
          { timeout: 4000, type: 'error' }
        )
        return
      }

      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: defaultSelectedAccount.addr }
      })

      if (keyType === 'internal') {
        try {
          if (!privKeyOrSeed) throw new Error('No private key or seed provided.')
          if (!accountAdderState.hdPathTemplate)
            throw new Error(
              'No HD path template provided. Please try to start the process of selecting accounts again. If the problem persist, please contact support.'
            )

          const keysToAddToKeystore = accountAdderState.selectedAccounts.map((acc) => {
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

          dispatch({
            type: 'KEYSTORE_CONTROLLER_ADD_KEYS',
            params: { keys: keysToAddToKeystore }
          })
        } catch (error: any) {
          console.error(error)

          addToast(
            'The selected accounts got imported, but Ambire failed to retrieve their keys. Please log out of these accounts and try to import them again. Until then, these accounts will be view only. If the problem persists, please contact support.',
            { timeout: 4000, type: 'error' }
          )
        }
      } else {
        dispatch({
          type: 'KEYSTORE_CONTROLLER_ADD_KEYS_EXTERNALLY_STORED',
          params: { keyType }
        })
      }

      const keyPreferencesToAdd = accountAdderState.selectedAccounts.map(
        ({ accountKeyAddr, slot, index }) => ({
          addr: accountKeyAddr,
          type: keyType,
          label: getDefaultKeyLabel(keyType, index, slot, keyLabel)
        })
      )

      dispatch({
        type: 'MAIN_CONTROLLER_SETTINGS_ADD_KEY_PREFERENCES',
        params: keyPreferencesToAdd
      })
    }
  }, [
    accountAdderState.addAccountsStatus,
    accountAdderState.hdPathTemplate,
    accountAdderState.readyToAddAccounts,
    accountAdderState.selectedAccounts,
    dispatch,
    keyLabel,
    keyType,
    privKeyOrSeed
  ])

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
    const latestMethodCall = keyType === 'internal' ? 'addKeys' : 'addKeysExternallyStored'
    if (keystoreState.status === 'DONE' && keystoreState.latestMethodCall === latestMethodCall) {
      completeStep()
    }
  }, [completeStep, keystoreState, keyType])

  const onImportReady = useCallback(() => {
    if (accountAdderState.selectedAccounts.length) {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_ADD_ACCOUNTS',
        params: { selectedAccounts: accountAdderState.selectedAccounts }
      })
      return
    }

    completeStep(false)
  }, [accountAdderState.selectedAccounts, dispatch, completeStep])

  return { setPage, onImportReady }
}

export default useAccountAdder
