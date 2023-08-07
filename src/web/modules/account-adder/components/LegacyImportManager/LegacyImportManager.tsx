/* eslint-disable react/destructuring-assignment */

import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import useBackgroundService from '@web/hooks/useBackgroundService'
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
  const { state, dispatch } = useBackgroundService('accountAdder')
  const { state: mainControllerState } = useBackgroundService('main')

  useEffect(() => {
    if (state.selectedAccounts) {
      console.log('main controller state changed')
    }
  }, [mainControllerState])

  const onImportReady = () => {
    dispatch({
      type: 'MAIN_CONTROLLER_CREATE_ACCOUNTS',
      params: {
        accounts: state.selectedAccounts
      }
    })

    // TODO: reset selected accounts

    // TODO:
    // updateStepperState(1, 'legacyAuth')
    // shouldCreateEmailVault
    //   ? navigate(WEB_ROUTES.createEmailVault, {
    //       state: {
    //         hideStepper: true,
    //         hideFormTitle: true
    //       }
    //     })
    //   : navigate(WEB_ROUTES.createKeyStore)
  }

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
    ;(async () => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_INIT_PRIVATE_KEY_OR_SEED_PHRASE',
        params: { privKeyOrSeed: props.privKeyOrSeed }
      })
    })()
  }, [dispatch, createTask, props.privKeyOrSeed])

  useEffect(() => {
    ;(async () => {
      if (!state.isInitialized) return
      setPage()
    })()
  }, [state.isInitialized, setPage])

  if (!Object.keys(state).length) {
    return
  }

  return (
    <AccountsOnPageList state={state} onImportReady={onImportReady} setPage={setPage} {...props} />
  )
}

export default React.memo(LegacyImportManager)
