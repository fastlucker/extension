import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { ROUTES } from '@common/modules/router/constants/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const AuthenticatedAndKeystoreUnlockedRoute = () => {
  const { authStatus } = useAuth()
  const keystoreState = useKeystoreControllerState()
  const [isReady, setIsReady] = useState(true)

  useEffect(() => {
    if (authStatus !== AUTH_STATUS.LOADING) {
      setIsReady(true)
    }
  }, [authStatus])

  // returns empty fragment because React Router complains
  // when the children of <Routes> are different from <Route /> and <Fragment />
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isReady) return <></>

  let to = null

  if (keystoreState.isReadyToStoreKeys && !keystoreState.isUnlocked) {
    to = ROUTES.keyStoreUnlock
  }
  if (authStatus !== AUTH_STATUS.AUTHENTICATED) {
    to = ROUTES.getStarted
  }

  return !to ? <Outlet /> : <Navigate to={to} />
}

export default AuthenticatedAndKeystoreUnlockedRoute
