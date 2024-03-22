/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { AddressBookController } from '@ambire-common/controllers/addressBook/addressBook'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const AddressBookControllerStateContext = createContext<AddressBookController>(
  {} as AddressBookController
)

const AddressBookControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as AddressBookController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()
  const { accountPreferences } = useSettingsControllerState()

  const accountsInWalletContacts = useMemo(() => {
    if (!accountPreferences || !mainState.accounts) return []

    return mainState.accounts
      .filter(({ addr }) => addr !== mainState.selectedAccount)
      .map((account) => ({
        name: accountPreferences[account.addr]?.label || DEFAULT_ACCOUNT_LABEL,
        address: account.addr
      }))
  }, [accountPreferences, mainState.accounts, mainState.selectedAccount])

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'addressBook' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: AddressBookController) => {
      setState(newState)
    }

    eventBus.addEventListener('addressBook', onUpdate)

    return () => eventBus.removeEventListener('addressBook', onUpdate)
  }, [])

  useEffect(() => {
    dispatch({
      type: 'ADDRESS_BOOK_CONTROLLER_SET_ACCOUNTS_IN_WALLET_CONTACTS',
      params: {
        accountsInWalletContacts
      }
    })
  }, [accountsInWalletContacts, dispatch])

  return (
    <AddressBookControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AddressBookControllerStateContext.Provider>
  )
}

export { AddressBookControllerStateProvider, AddressBookControllerStateContext }
