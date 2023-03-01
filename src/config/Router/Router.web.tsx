import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { lazy, Suspense, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Outlet, Route, Routes } from 'react-router-dom'

import { headerBeta as defaultHeaderBeta } from '@config/Router/HeadersConfig'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation'
import useRoute from '@modules/common/hooks/useRoute'
import flexbox from '@modules/common/styles/utils/flexbox'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import ResetVaultScreen from '@modules/vault/screens/ResetVaultScreen'
import UnlockVaultScreen from '@modules/vault/screens/UnlockVaultScreen'

import { ROUTES } from './routesConfig'
import SortHat from './SortHat.web'

const AsyncMainRoute = lazy(() => import('./MainRoutes.web'))

const headerBeta = (
  <>
    {defaultHeaderBeta({})}
    <Outlet />
  </>
)

const Router = () => {
  const { hasCheckedForApprovalInitially } = useExtensionApproval()
  const { vaultStatus, unlockVault, resetVault, biometricsEnabled } = useVault()
  const { path } = useRoute()
  const { navigate } = useNavigation()
  const { authStatus } = useAuth()
  const prevAuthStatus = usePrevious(authStatus)
  const prevVaultStatus = usePrevious(vaultStatus)

  useEffect(() => {
    if (
      path !== '/' &&
      authStatus !== prevAuthStatus &&
      authStatus !== AUTH_STATUS.LOADING &&
      prevAuthStatus !== AUTH_STATUS.LOADING
    ) {
      navigate('/', { replace: true })
    }
  }, [authStatus, navigate, path, prevAuthStatus])

  useEffect(() => {
    if (
      path !== '/' &&
      vaultStatus !== prevVaultStatus &&
      vaultStatus !== VAULT_STATUS.LOADING &&
      prevVaultStatus !== VAULT_STATUS.LOADING
    ) {
      navigate('/', { replace: true })
    }
  }, [vaultStatus, navigate, path, prevVaultStatus])

  if (!hasCheckedForApprovalInitially) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.center]}>
        <Spinner />
      </View>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<SortHat />} />
        <Route element={headerBeta}>
          <Route
            path={ROUTES.unlockVault}
            element={
              <UnlockVaultScreen
                unlockVault={unlockVault}
                vaultStatus={vaultStatus}
                biometricsEnabled={biometricsEnabled}
              />
            }
          />
          <Route
            path={ROUTES.resetVault}
            element={<ResetVaultScreen resetVault={resetVault} vaultStatus={vaultStatus} />}
          />
        </Route>
      </Routes>
      <Suspense fallback={null}>
        <AsyncMainRoute />
      </Suspense>
    </>
  )
}

export default Router
