import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { lazy, Suspense, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'

import { headerBeta as defaultHeaderBeta } from '@config/Router/HeadersConfig'
import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation'
import flexbox from '@modules/common/styles/utils/flexbox'
import useVault from '@modules/vault/hooks/useVault'
import ResetVaultScreen from '@modules/vault/screens/ResetVaultScreen'
import UnlockVaultScreen from '@modules/vault/screens/UnlockVaultScreen'

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
  const { pathname } = useLocation()
  const { navigate } = useNavigation()
  const { authStatus } = useAuth()
  const prevAuthStatus = usePrevious(authStatus)
  const prevVaultStatus = usePrevious(vaultStatus)

  useEffect(() => {
    if (pathname !== '/' && authStatus !== prevAuthStatus) {
      navigate('/')
    }
  }, [authStatus, navigate, pathname, prevAuthStatus])

  useEffect(() => {
    if (pathname !== '/' && vaultStatus !== prevVaultStatus) {
      navigate('/')
    }
  }, [vaultStatus, navigate, pathname, prevVaultStatus])

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
            path="unlock-vault"
            element={
              <UnlockVaultScreen
                unlockVault={unlockVault}
                vaultStatus={vaultStatus}
                biometricsEnabled={biometricsEnabled}
              />
            }
          />
          <Route
            path="reset-vault"
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
