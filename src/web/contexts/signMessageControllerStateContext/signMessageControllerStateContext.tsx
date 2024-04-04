/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import { SignMessageController } from '@ambire-common/controllers/signMessage/signMessage'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'

const SignMessageControllerStateContext = createContext<SignMessageController>(
  {} as SignMessageController
)

const SignMessageControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as SignMessageController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller: 'signMessage' } })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: SignMessageController) => {
      setState(newState)
    }

    eventBus.addEventListener('signMessage', onUpdate)

    return () => eventBus.removeEventListener('signMessage', onUpdate)
  }, [])

  return (
    <SignMessageControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </SignMessageControllerStateContext.Provider>
  )
}

export { SignMessageControllerStateProvider, SignMessageControllerStateContext }
