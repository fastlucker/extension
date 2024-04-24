/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { KeystoreController } from '@ambire-common/controllers/keystore/keystore'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useControllerState from '@web/hooks/useControllerState'

const KeystoreControllerStateContext = createContext<KeystoreController>({} as KeystoreController)

const KeystoreControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'keystore'
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

  return (
    <KeystoreControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </KeystoreControllerStateContext.Provider>
  )
}

export { KeystoreControllerStateProvider, KeystoreControllerStateContext }
