import usePrevious from 'ambire-common/src/hooks/usePrevious'
import React, { lazy, Suspense, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Outlet, Route, Routes } from 'react-router-dom'

import Spinner from '@common/components/Spinner'
import useExtensionApproval from '@common/hooks/useExtensionApproval'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { headerBeta as defaultHeaderBeta } from '@common/modules/header/config/headerConfig'
import { ROUTES } from '@common/modules/router/config/routesConfig'
import flexbox from '@common/styles/utils/flexbox'
import { AUTH_STATUS } from '@mobile/auth/constants/authStatus'
import useAuth from '@mobile/auth/hooks/useAuth'
import { VAULT_STATUS } from '@mobile/vault/constants/vaultStatus'
import useVault from '@mobile/vault/hooks/useVault'
import ResetVaultScreen from '@mobile/vault/screens/ResetVaultScreen'
import UnlockVaultScreen from '@mobile/vault/screens/UnlockVaultScreen'
import SortHat from '@web/modules/router/components/SortHat'

const AsyncMainRoute = lazy(() => import('@web/modules/router/components/MainRoutes'))

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
