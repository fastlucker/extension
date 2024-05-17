/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { ActionsController } from '@ambire-common/controllers/actions/actions'
import { isSignMethod } from '@ambire-common/libs/actions/actions'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import { getUiType } from '@web/utils/uiType'

const ActionsControllerStateContext = createContext<ActionsController>({} as ActionsController)

const ActionsControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'actions'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const prevState: Ac = usePrevious(state) || ({} as ActionsController)
  const { path } = useRoute()

  const { navigate } = useNavigation()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  useEffect(() => {
    if (getUiType().isActionWindow) {
      const id = state.currentAction?.id
      const prevId = prevState?.currentAction?.id
      if (prevId !== id) {
        setTimeout(() => navigate('/'))
      }
    }
  }, [prevState.currentAction?.id, state.currentAction?.id, navigate])

  // if current window type is popup or tab and
  // there is an unfocused notification window
  // reopen it and close the current window
  // this behavior will happen until the request in the notification window is resolved/rejected
  // TODO:
  // useEffect(() => {
  //   const isActionWindow = getUiType().isActionWindow
  //   if (
  //     !isActionWindow &&
  //     state.notificationWindowId &&
  //     state.currentAction &&
  //     !isSignMethod(state.currentAction?.method) &&
  //     state.currentAction?.method !== 'benzin'
  //   ) {
  //     dispatch({
  //       type: 'ACTIONS_CONTROLLER_FOCUS_ACTION_WINDOW',
  //       params: 'Please resolve your pending request first.'
  //     })
  //     window.close()
  //   }
  // }, [dispatch, state.currentAction?.method, state.notificationWindowId, state.currentAction])

  // useEffect(() => {
  //   const isPopup = getUiType().isPopup
  //   if (
  //     isPopup &&
  //     state.notificationWindowId &&
  //     state.currentAction &&
  //     isSignMethod(state.currentAction?.method)
  //   ) {
  //     dispatch({
  //       type: 'ACTIONS_CONTROLLER_FOCUS_ACTION_WINDOW',
  //       params: 'Please resolve your pending request first.'
  //     })
  //     window.close()
  //   }
  // }, [dispatch, state.currentAction?.method, state.notificationWindowId, state.currentAction, path])

  return (
    <ActionsControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </ActionsControllerStateContext.Provider>
  )
}

export { ActionsControllerStateProvider, ActionsControllerStateContext }
