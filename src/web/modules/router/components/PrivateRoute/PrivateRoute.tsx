import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '@common/modules/router/config/routesConfig'
import { AUTH_STATUS } from '@mobile/auth/constants/authStatus'
import useAuth from '@mobile/auth/hooks/useAuth'
import { VAULT_STATUS } from '@mobile/vault/constants/vaultStatus'
import useVault from '@mobile/vault/hooks/useVault'

const PrivateRoute = () => {
  const { vaultStatus } = useVault()
  const { authStatus } = useAuth()

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (vaultStatus !== VAULT_STATUS.LOADING && authStatus !== AUTH_STATUS.LOADING) {
      setIsReady(true)
    }
  }, [vaultStatus, authStatus])

  // returns empty fragment because React Router complains
  // when the children of <Routes> are different from <Route /> and <Fragment />
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!isReady) return <></>

  let to = null

  // TODO: Remove when vault initialization gets optional (ambire v2.0)
  if (vaultStatus === VAULT_STATUS.NOT_INITIALIZED) {
    to = ROUTES.getStarted
  } else if (vaultStatus === VAULT_STATUS.LOCKED) {
    to = ROUTES.unlockVault
  } else if (authStatus !== AUTH_STATUS.AUTHENTICATED) {
    to = ROUTES.auth
  }

  return !to ? <Outlet /> : <Navigate to={to} />
}

export default PrivateRoute
