import React, { createContext, useEffect, useMemo, useState } from 'react'

import { AddressBookController } from '@ambire-common/controllers/addressBook/addressBook'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const AddressBookControllerStateContext = createContext<AddressBookController>(
  {} as AddressBookController
)

const AddressBookControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as AddressBookController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

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

  return (
    <AddressBookControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AddressBookControllerStateContext.Provider>
  )
}

export { AddressBookControllerStateProvider, AddressBookControllerStateContext }
