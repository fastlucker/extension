import { createContext, useEffect, useMemo } from 'react'

import { UpdateAvailableController } from '@web/extension-services/background/controllers/update-available'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'

const UpdateAvailableControllerStateContext = createContext<UpdateAvailableController>(
  {} as UpdateAvailableController
)

const UpdateAvailableControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'updateAvailable'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  return (
    <UpdateAvailableControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </UpdateAvailableControllerStateContext.Provider>
  )
}

export { UpdateAvailableControllerStateProvider, UpdateAvailableControllerStateContext }
