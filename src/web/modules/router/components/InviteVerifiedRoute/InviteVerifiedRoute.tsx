import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { INVITE_STATUS } from '@ambire-common/controllers/invite/invite'
import { ROUTES } from '@common/modules/router/constants/common'
import useInviteControllerState from '@web/hooks/useInviteControllerState'

const InviteVerifiedRoute = () => {
  const { inviteStatus } = useInviteControllerState()

  if (inviteStatus === INVITE_STATUS.VERIFIED) return <Outlet />

  return <Navigate to={ROUTES.inviteVerify} />
}

export default InviteVerifiedRoute
