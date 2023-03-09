import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import useExtensionApproval from '@common/hooks/useExtensionApproval'
import useNavigation from '@common/hooks/useNavigation'
import flexbox from '@common/styles/utils/flexbox'
import { AUTH_STATUS } from '@mobile/auth/constants/authStatus'
import useAuth from '@mobile/auth/hooks/useAuth'
import { ONBOARDING_VALUES } from '@mobile/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@mobile/onboarding/hooks/useOnboarding'
import { VAULT_STATUS } from '@mobile/vault/constants/vaultStatus'
import useVault from '@mobile/vault/hooks/useVault'
import { getUiType } from '@web/utils/uiType'

import { ROUTES } from './routesConfig'

const SortHat = () => {
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()
  const { approval } = useExtensionApproval()
  const isInNotification = getUiType().isNotification
  const { vaultStatus } = useVault()
  const { onboardingStatus } = useOnboarding()

  const loadView = useCallback(async () => {
    if (vaultStatus === VAULT_STATUS.LOADING) return

    if (isInNotification && !approval) {
      window.close()
      return
    }

    if (vaultStatus === VAULT_STATUS.NOT_INITIALIZED) {
      return navigate(ROUTES.getStarted)
    }

    if (vaultStatus === VAULT_STATUS.LOCKED) {
      return navigate(ROUTES.unlockVault)
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return navigate(ROUTES.auth)
    }

    if (approval && isInNotification) {
      if (approval?.data?.approvalComponent === 'PermissionRequest') {
        return navigate(ROUTES.permissionRequest)
      }
      if (approval?.data?.approvalComponent === 'SendTransaction') {
        return navigate(ROUTES.pendingTransactions)
      }
      if (approval?.data?.approvalComponent === 'SignText') {
        return navigate(ROUTES.signMessage)
      }
      if (approval?.data?.approvalComponent === 'SignTypedData') {
        return navigate(ROUTES.signMessage)
      }
      if (approval?.data?.approvalComponent === 'SwitchNetwork') {
        return navigate(ROUTES.switchNetwork)
      }
      if (approval?.data?.approvalComponent === 'WalletWatchAsset') {
        return navigate(ROUTES.watchAsset)
      }
      if (approval?.data?.approvalComponent === 'GetEncryptionPublicKey') {
        return navigate(ROUTES.getEncryptionPublicKeyRequest)
      }
    } else {
      navigate(
        onboardingStatus === ONBOARDING_VALUES.ON_BOARDED ? ROUTES.dashboard : ROUTES.onboarding
      )
    }
  }, [isInNotification, vaultStatus, approval, navigate, authStatus, onboardingStatus])

  useEffect(() => {
    loadView()
  }, [loadView])

  return (
    <View style={[StyleSheet.absoluteFill, flexbox.center]}>
      <Spinner />
    </View>
  )
}

export default SortHat
