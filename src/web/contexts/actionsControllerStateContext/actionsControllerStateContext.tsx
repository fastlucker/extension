/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect } from 'react'

import { ActionsController } from '@ambire-common/controllers/actions/actions'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import { getUiType } from '@web/utils/uiType'

const ActionsControllerStateContext = createContext<ActionsController>({} as ActionsController)

const ActionsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'actions'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const { navigate } = useNavigation()

  useEffect(() => {
    dispatch({ type: 'INIT_CONTROLLER_STATE', params: { controller } })
    if (getUiType().isActionWindow) {
      dispatch({ type: 'ACTIONS_CONTROLLER_SET_WINDOW_LOADED' })
    }
  }, [dispatch])

  const memoizedState = useDeepMemo(state, controller)

  const prevCurrentActionId = usePrevious(memoizedState.currentAction?.id)

  useEffect(() => {
    if (getUiType().isActionWindow && prevCurrentActionId !== memoizedState.currentAction?.id) {
      setTimeout(() => navigate('/'))
    }
  }, [prevCurrentActionId, memoizedState.currentAction?.id, navigate])

  return (
    <ActionsControllerStateContext.Provider value={memoizedState}>
      {children}
    </ActionsControllerStateContext.Provider>
  )
}

export { ActionsControllerStateProvider, ActionsControllerStateContext }
