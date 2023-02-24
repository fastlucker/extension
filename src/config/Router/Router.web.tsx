import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { lazy, Suspense, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Outlet, Route, Routes } from 'react-router-dom'

import { headerBeta as defaultHeaderBeta } from '@config/Router/HeadersConfig'
import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation'
import useRoute from '@modules/common/hooks/useRoute'
import flexbox from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'
import ResetVaultScreen from '@modules/vault/screens/ResetVaultScreen'
import UnlockVaultScreen from '@modules/vault/screens/UnlockVaultScreen'

import routesConfig from './routesConfig'
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
    if (path !== '/' && authStatus !== prevAuthStatus) {
      navigate('/')
    }
  }, [authStatus, navigate, path, prevAuthStatus])

  useEffect(() => {
    if (path !== '/' && vaultStatus !== prevVaultStatus) {
      navigate('/')
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
            path={routesConfig['unlock-vault'].route}
            element={
              <UnlockVaultScreen
                unlockVault={unlockVault}
                vaultStatus={vaultStatus}
                biometricsEnabled={biometricsEnabled}
              />
            }
          />
          <Route
            path={routesConfig['reset-vault'].route}
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
