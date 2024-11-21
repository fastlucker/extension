import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '@common/modules/router/constants/common'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

const KeystoreUnlockedRoute = () => {
  const keystoreState = useKeystoreControllerState()
  const shouldNavigateToUnlock = keystoreState.isReadyToStoreKeys && !keystoreState.isUnlocked

  return shouldNavigateToUnlock ? <Navigate to={ROUTES.keyStoreUnlock} /> : <Outlet />
}

export default KeystoreUnlockedRoute
