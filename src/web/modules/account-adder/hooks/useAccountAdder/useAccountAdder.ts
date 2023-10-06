import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect } from 'react'

import { Key } from '@ambire-common/interfaces/keystore'
import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useTaskQueue from '@web/modules/hardware-wallet/hooks/useTaskQueue'

import { getDefaultSelectedAccount } from '../../helpers/account'
import getPrivateKeyFromSeed from '../../services/getPrivateKeyFromSeed'

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
    const step = keyType === 'internal' ? 'legacy' : 'hw'
    updateStepperState(WEB_ROUTES.accountAdder, step)
  }, [keyType, updateStepperState])

  useEffect(() => {
    if (!mainControllerState.isReady) return
    if (accountAdderState.isInitialized) return

    const init = {
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
      lattice: () => dispatch({ type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_LATTICE', params: {} })
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

      if (keyType === 'internal') {
        try {
          if (!privKeyOrSeed) throw new Error('No private key or seed provided.')

          const keysToAddToKeystore = accountAdderState.selectedAccounts.map((acc) => {
            let privateKey = privKeyOrSeed

            // in case props.privKeyOrSeed is a seed the private keys have to be extracted
            if (Mnemonic.isValidMnemonic(privKeyOrSeed)) {
              privateKey = getPrivateKeyFromSeed(
                privKeyOrSeed,
                // The slot is the key index from the derivation path
                acc.slot - 1,
                accountAdderState.derivationPath
              )
            }

            return {
              privateKey,
              label: `${{ keyLabel }} for the account on slot ${acc.slot}`
            }
          })

          dispatch({
            type: 'KEYSTORE_CONTROLLER_ADD_KEYS',
            params: { keys: keysToAddToKeystore }
          })
        } catch (error: any) {
          console.error(error)
          // TODO: display error toast
          // eslint-disable-next-line no-alert
          alert(
            'The selected accounts got imported, but Ambire failed to retrieve their keys. Please log out of these accounts and try to import them again. Until then, these accounts will be view only. If the problem persists, please contact support.'
          )
        }
      } else {
        dispatch({
          type: 'KEYSTORE_CONTROLLER_ADD_KEYS_EXTERNALLY_STORED',
          params: { keyType }
        })
      }
    }
  })

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/')
    },
    [navigate]
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
        params: { accounts: accountAdderState.selectedAccounts }
      })
      return
    }

    completeStep(false)
  }, [accountAdderState.selectedAccounts, dispatch, completeStep])

  return { setPage, onImportReady }
}

export default useAccountAdder
