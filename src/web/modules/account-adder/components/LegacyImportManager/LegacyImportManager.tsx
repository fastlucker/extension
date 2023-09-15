/* eslint-disable react/destructuring-assignment */

import { Mnemonic } from 'ethers'
import React, { useCallback, useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import alert from '@common/services/alert'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState/useMainControllerState'
import AccountsOnPageList from '@web/modules/account-adder/components/AccountsOnPageList'
import { getDefaultSelectedAccount } from '@web/modules/account-adder/helpers/account'
import getPrivateKeyFromSeed from '@web/modules/account-adder/services/getPrivateKeyFromSeed'

interface Props {
  privKeyOrSeed: string
  label: string
}

const LegacyImportManager = (props: Props) => {
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { dispatch } = useBackgroundService()
  const accountAdderState = useAccountAdderControllerState()
  const mainControllerState = useMainControllerState()
  const keystoreState = useKeystoreControllerState()
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

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      updateStepperState(1, 'legacy')

      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/')
    },
    [navigate, updateStepperState]
  )

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

      try {
        const keysToAddToKeystore = accountAdderState.selectedAccounts.map((acc) => {
          let privateKey = props.privKeyOrSeed

          // in case props.privKeyOrSeed is a seed the private keys have to be extracted
          if (Mnemonic.isValidMnemonic(props.privKeyOrSeed)) {
            privateKey = getPrivateKeyFromSeed(
              props.privKeyOrSeed,
              // The slot is the key index from the derivation path
              acc.slot - 1,
              accountAdderState.derivationPath
            )
          }

          return {
            privateKey,
            label: `${props.label} for the account on slot ${acc.slot}`
          }
        })

        dispatch({
          type: 'KEYSTORE_CONTROLLER_ADD_KEYS',
          params: { keys: keysToAddToKeystore }
        })
      } catch (error: any) {
        // TODO: display error toast
        // if the add keys fails we should probably remove the stored accounts
        // or dont add them at all before successfully adding the keys to the keystore
        alert(error?.message || 'keystore add keys failed')
      }
    }
  }, [
    props.privKeyOrSeed,
    props.label,
    accountAdderState,
    updateStepperState,
    navigate,
    dispatch,
    accountAdderState.readyToAddAccounts,
    completeStep
  ])

  useEffect(() => {
    if (keystoreState.status === 'DONE' && keystoreState.latestMethodCall === 'addKeys') {
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

export default React.memo(LegacyImportManager)
