import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { ROUTES } from '@common/modules/router/constants/common'

const AuthenticatedRoute = () => {
  const { authStatus } = useAuth()

  // returns empty fragment because React Router complains
  // when the children of <Routes> are different from <Route /> and <Fragment />
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (authStatus === AUTH_STATUS.LOADING) return <></>

  const shouldNavigateToGetStarted = authStatus !== AUTH_STATUS.AUTHENTICATED

  return shouldNavigateToGetStarted ? <Navigate to={ROUTES.getStarted} /> : <Outlet />
}

export default AuthenticatedRoute
