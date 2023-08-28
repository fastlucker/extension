import { useContext } from 'react'

import { NotificationControllerStateContext } from '@web/contexts/notificationControllerStateContext'

export default function useNotificationControllerState() {
  const context = useContext(NotificationControllerStateContext)

  if (!context) {
    throw new Error(
      'useNotificationControllerState must be used within a NotificationControllerStateProvider'
    )
  }

  return context
}
