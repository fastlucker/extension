/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { KeystoreController } from '@ambire-common/controllers/keystore/keystore'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const KeystoreControllerStateContext = createContext<KeystoreController>({} as KeystoreController)

const KeystoreControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as KeystoreController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller: 'keystore' }
      })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: KeystoreController) => {
      setState(newState)
    }

    eventBus.addEventListener('keystore', onUpdate)

    return () => eventBus.removeEventListener('keystore', onUpdate)
  }, [])

  return (
    <KeystoreControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </KeystoreControllerStateContext.Provider>
  )
}

export { KeystoreControllerStateProvider, KeystoreControllerStateContext }
