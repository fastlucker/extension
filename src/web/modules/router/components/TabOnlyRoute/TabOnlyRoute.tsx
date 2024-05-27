import React from 'react'
import { Outlet } from 'react-router-dom'

import useRoute from '@common/hooks/useRoute'
import { isExtension } from '@web/constants/browserapi'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import { getUiType } from '@web/utils/uiType'

const TabOnlyRoute = () => {
  const isTab = getUiType().isTab
  const isActionWindow = getUiType().isActionWindow
  const { path, search } = useRoute()
  const state = useActionsControllerState()

  // if the current window is action-window and there is a action request don't open
  // the route in tab because the dApp that requests the action request
  // will loose the session with the wallet and the action request response won't arrive
  if (isActionWindow && state.currentAction) {
    return <Outlet />
  }

  if (!isTab && isExtension) {
    openInternalPageInTab(`${path?.substring(1)}${search}`)
    return <></>
  }

  return <Outlet />
}

export default TabOnlyRoute
