/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useEffect, useMemo } from 'react'

import { NotificationController } from '@ambire-common/controllers/notification/notification'
import { isSignMethod } from '@ambire-common/libs/notification/notification'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useRoute from '@common/hooks/useRoute'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import { getUiType } from '@web/utils/uiType'

const NotificationControllerStateContext = createContext<NotificationController>(
  {} as NotificationController
)

const NotificationControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'notification'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const prevState: NotificationController = usePrevious(state) || ({} as NotificationController)
  const { path } = useRoute()

  const { navigate } = useNavigation()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller }
    })
  }, [dispatch])

  // after a change in the notification request navigate to SortHat to manage the next screen
  // based on the notification type or if notif request is null to open some of the other internal screens of the wallet
  useEffect(() => {
    if (getUiType().isNotification) {
      const id = state.currentNotificationRequest?.id
      const prevId = prevState?.currentNotificationRequest?.id
      if (prevId !== id) {
        setTimeout(() => navigate('/'))
      }
    }
  }, [prevState.currentNotificationRequest?.id, state.currentNotificationRequest?.id, navigate])

  // if current window type is popup or tab and
  // there is an unfocused notification window
  // reopen it and close the current window
  // this behavior will happen until the request in the notification window is resolved/rejected
  useEffect(() => {
    const isNotification = getUiType().isNotification
    if (
      !isNotification &&
      state.notificationWindowId &&
      state.currentNotificationRequest &&
      !isSignMethod(state.currentNotificationRequest?.method) &&
      state.currentNotificationRequest?.method !== 'benzin'
    ) {
      dispatch({
        type: 'NOTIFICATION_CONTROLLER_FOCUS_CURRENT_NOTIFICATION_REQUEST',
        params: 'Please resolve your pending request first.'
      })
      window.close()
    }
  }, [
    dispatch,
    state.currentNotificationRequest?.method,
    state.notificationWindowId,
    state.currentNotificationRequest
  ])

  useEffect(() => {
    const isPopup = getUiType().isPopup
    if (
      isPopup &&
      state.notificationWindowId &&
      state.currentNotificationRequest &&
      isSignMethod(state.currentNotificationRequest?.method)
    ) {
      dispatch({
        type: 'NOTIFICATION_CONTROLLER_FOCUS_CURRENT_NOTIFICATION_REQUEST',
        params: 'Please resolve your pending request first.'
      })
      window.close()
    }
  }, [
    dispatch,
    state.currentNotificationRequest?.method,
    state.notificationWindowId,
    state.currentNotificationRequest,
    path
  ])

  return (
    <NotificationControllerStateContext.Provider value={useMemo(() => state, [state])}>
      {children}
    </NotificationControllerStateContext.Provider>
  )
}

export { NotificationControllerStateProvider, NotificationControllerStateContext }
