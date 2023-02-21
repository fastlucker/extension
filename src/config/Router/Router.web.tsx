import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Route, Routes } from 'react-router-dom'

import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import useStorageController from '@modules/common/hooks/useStorageController'
import { navigate, navigationRef, routeNameRef } from '@modules/common/services/navigation'
import colors from '@modules/common/styles/colors'
import flexbox from '@modules/common/styles/utils/flexbox'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import UnlockVaultScreen from '@modules/vault/screens/UnlockVaultScreen'
import { getUiType } from '@web/utils/uiType'

import SortHat from './SortHat.web'

const AsyncMainRoute = lazy(() => import('./MainRoutes.web'))

const Router = () => {
  const { authStatus } = useAuth()

  const { connectionState } = useNetInfo()
  const { approval, hasCheckedForApprovalInitially } = useExtensionApproval()
  const isInNotification = getUiType().isNotification
  const { vaultStatus, unlockVault, resetVault, biometricsEnabled } = useVault()

  const isInTab = getUiType().isTab
  const { getApproval } = useExtensionApproval()
  const { extensionWallet } = useExtensionWallet()

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
        <Route
          path="/unlock-vault"
          element={
            <UnlockVaultScreen
              unlockVault={unlockVault}
              vaultStatus={vaultStatus}
              biometricsEnabled={biometricsEnabled}
            />
          }
        />
      </Routes>
      <Suspense fallback={null}>
        <AsyncMainRoute />
      </Suspense>
    </>
  )
}

export default Router
