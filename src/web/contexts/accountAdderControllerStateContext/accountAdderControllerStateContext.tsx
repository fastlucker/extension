/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import AccountAdderController from '@ambire-common/controllers/accountAdder/accountAdder'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import { flushSync } from 'react-dom'

const AccountAdderControllerStateContext = createContext<AccountAdderController>(
  {} as AccountAdderController
)

const AccountAdderControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as AccountAdderController)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (!Object.keys(state).length) {
      dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller: 'accountAdder' } })
    }
  }, [dispatch, mainState.isReady, state])

  useEffect(() => {
    const onUpdate = (newState: AccountAdderController, forceEmit?: boolean) => {
      if (forceEmit) {
        flushSync(() => setState(newState))
      } else {
        setState(newState)
      }
    }

    eventBus.addEventListener('accountAdder', onUpdate)

    return () => eventBus.removeEventListener('accountAdder', onUpdate)
  }, [])

  return (
    <AccountAdderControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </AccountAdderControllerStateContext.Provider>
  )
}

export { AccountAdderControllerStateProvider, AccountAdderControllerStateContext }
