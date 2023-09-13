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
          'Failed to select default account. Please try to start the process of selecting accounts again. If the problem persist, please contact support.'
        )
        return
      }

      dispatch({
        type: 'MAIN_CONTROLLER_SELECT_ACCOUNT',
        params: { accountAddr: defaultSelectedAccount.addr }
      })

      try {
        // TODO: Use method that adds multiple keys at once
        dispatch({
          type: 'KEYSTORE_CONTROLLER_ADD_KEY_EXTERNALLY_STORED'
        })
        // const keysToAddToKeystore = accountAdderState.selectedAccounts.map((acc) => {
        //   let privateKey = props.privKeyOrSeed
        //   // in case props.privKeyOrSeed is a seed the private keys have to be extracted
        //   if (Mnemonic.isValidMnemonic(props.privKeyOrSeed)) {
        //     // The slot is the key index from the derivation path
        //     const slotIdx = accountAdderState.accountsOnPage.find(
        //       (accOnPage) => accOnPage.account.addr === acc.addr
        //     )?.slot
        //     privateKey = getPrivateKeyFromSeed(props.privKeyOrSeed, (slotIdx || 0) - 1)
        //   }
        //   return {
        //     privateKey,
        //     label: props.label
        //   }
        // })
        // dispatch({
        //   type: 'KEYSTORE_CONTROLLER_ADD_KEYS',
        //   params: { keys: keysToAddToKeystore }
        // })
      } catch (error: any) {
        // TODO: display error toast
        // if the add keys fails we should probably remove the stored accounts
        // or dont add them at all before successfully adding the keys to the keystore
        alert(error?.message || 'keystore add keys failed')
      }
    }
  })

  const completeStep = useCallback(
    (hasAccountsToImport: boolean = true) => {
      updateStepperState(2, 'hw')

      navigate(hasAccountsToImport ? WEB_ROUTES.accountPersonalize : '/')
    },
    [navigate, updateStepperState]
  )

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

export default React.memo(TrezorManager)
