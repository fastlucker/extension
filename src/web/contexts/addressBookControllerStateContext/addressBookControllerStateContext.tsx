import React, { createContext, useEffect, useMemo } from 'react'

import { AddressBookController } from '@ambire-common/controllers/addressBook/addressBook'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

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

  const memoizedState = useDeepMemo(state, controller)

  return (
    <AddressBookControllerStateContext.Provider
      value={useMemo(() => memoizedState, [memoizedState])}
    >
      {children}
    </AddressBookControllerStateContext.Provider>
  )
}

export { AddressBookControllerStateProvider, AddressBookControllerStateContext }
