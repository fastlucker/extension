import React from 'react'
import { Outlet } from 'react-router-dom'

import useRoute from '@common/hooks/useRoute'
import { isExtension } from '@web/constants/browserapi'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import { getUiType } from '@web/utils/uiType'

const TabOnlyRoute = () => {
  const isTab = getUiType().isTab
  const isNotification = getUiType().isNotification
  const { path, search } = useRoute()
  const state = useNotificationControllerState()

  // if the current window is notification and there is a notification request don't open
  // the route in tab because the dApp that requests the notification request
  // will loose the session with the wallet and the notification request response won't arrive
  if (isNotification && state.currentNotificationRequest) {
    return <Outlet />
  }

  if (!isTab && isExtension) {
    openInternalPageInTab(`${path?.substring(1)}${search}`)
    return <></>
  }

  return <Outlet />
}

export default TabOnlyRoute
