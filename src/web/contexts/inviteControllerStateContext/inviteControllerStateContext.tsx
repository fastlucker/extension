/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { InviteController } from '@web/extension-services/background/controllers/invite'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const InviteControllerStateContext = createContext<InviteController>({} as InviteController)

const CONTROLLER_NAME = 'invite'
const InviteControllerStateProvider: React.FC<any> = ({ children }) => {
  const state = useControllerState(CONTROLLER_NAME)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: CONTROLLER_NAME }
    })
  }, [dispatch])

  return (
    <InviteControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </InviteControllerStateContext.Provider>
  )
}

export { InviteControllerStateProvider, InviteControllerStateContext }
