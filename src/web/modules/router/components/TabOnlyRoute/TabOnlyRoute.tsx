import React from 'react'
import { Outlet } from 'react-router-dom'

import useRoute from '@common/hooks/useRoute'
import { isExtension } from '@web/constants/browserapi'
import { openInternalPageInTab } from '@web/extension-services/background/webapi/tab'
import useApproval from '@web/hooks/useApproval'
import { getUiType } from '@web/utils/uiType'

const TabOnlyRoute = () => {
  const isTab = getUiType().isTab
  const isNotification = getUiType().isNotification
  const { path } = useRoute()
  const { approval } = useApproval()

  // if the current window is notification and there is an approval don't open
  // the route in tab because the dApp that requests the approval
  // will loose the session with the wallet and the approval response won't arrive
  if (isNotification && !!approval) {
    return <Outlet />
  }

  if (!isTab && isExtension) {
    openInternalPageInTab(path?.substring(1))
    return <></>
  }

  return <Outlet />
}

export default TabOnlyRoute
