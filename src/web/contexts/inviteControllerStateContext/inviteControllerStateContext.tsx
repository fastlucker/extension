/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { InviteController } from '@web/extension-services/background/controllers/invite'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const InviteControllerStateContext = createContext<InviteController>({} as InviteController)

const InviteControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'invite'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  return (
    <InviteControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </InviteControllerStateContext.Provider>
  )
}

export { InviteControllerStateProvider, InviteControllerStateContext }
