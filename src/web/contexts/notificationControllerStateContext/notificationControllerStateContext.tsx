/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo, useState } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import { NotificationController } from '@web/extension-services/background/controllers/notification'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

const NotificationControllerStateContext = createContext<NotificationController>(
  {} as NotificationController
)

const NotificationControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState({} as NotificationController)
  const { dispatch } = useBackgroundService()
  const prevState = usePrevious(state) || ({} as NotificationController)
  const { navigate } = useNavigation()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'notification' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = (newState: NotificationController) => {
      setState(newState)
    }

    eventBus.addEventListener('notification', onUpdate)

    return () => eventBus.removeEventListener('notification', onUpdate)
  }, [])

  useEffect(() => {
    const id = state.currentNotificationRequest?.id
    const prevId = prevState?.currentNotificationRequest?.id
    if (prevId !== id) {
      setTimeout(() => navigate('/'))
    }
  }, [prevState.currentNotificationRequest?.id, state.currentNotificationRequest?.id, navigate])

  return (
    <NotificationControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </NotificationControllerStateContext.Provider>
  )
}

export { NotificationControllerStateProvider, NotificationControllerStateContext }
