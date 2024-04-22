import React, { createContext, useEffect, useMemo } from 'react'

import { AddressBookController } from '@ambire-common/controllers/addressBook/addressBook'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

const AddressBookControllerStateContext = createContext<AddressBookController>(
  {} as AddressBookController
)

const AddressBookControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'addressBook'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    dispatch({
      type: 'TRANSFER_CONTROLLER_CHECK_IS_RECIPIENT_ADDRESS_UNKNOWN'
    })
  }, [state?.contacts?.length, dispatch])

  return (
    <AddressBookControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AddressBookControllerStateContext.Provider>
  )
}

export { AddressBookControllerStateProvider, AddressBookControllerStateContext }
