import AccountAdderController from 'ambire-common/src/controllers/accountAdder/accountAdder'
/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const AccountAdderControllerStateContext = createContext<AccountAdderController>(
  {} as AccountAdderController
)

const AccountAdderControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as AccountAdderController)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'accountAdder' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = (newState: AccountAdderController) => {
      setState(newState)
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
