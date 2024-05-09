import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '@common/modules/router/constants/common'
import { INVITE_STATUS } from '@web/extension-services/background/controllers/invite'
import useInviteControllerState from '@web/hooks/useInviteControllerState/useInviteControllerState'

const InviteVerifiedRoute = () => {
  const { inviteStatus } = useInviteControllerState()

  if (inviteStatus === INVITE_STATUS.VERIFIED) return <Outlet />

  return <Navigate to={ROUTES.inviteVerify} />
}

export default InviteVerifiedRoute
