import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import useNavigation from '@modules/common/hooks/useNavigation'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import useStorageController from '@modules/common/hooks/useStorageController'
import colors from '@modules/common/styles/colors'
import flexbox from '@modules/common/styles/utils/flexbox'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import UnlockVaultScreen from '@modules/vault/screens/UnlockVaultScreen'
import { getUiType } from '@web/utils/uiType'

const Router = () => {
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()
  const { connectionState } = useNetInfo()
  const { approval, hasCheckedForApprovalInitially } = useExtensionApproval()
  const isInNotification = getUiType().isNotification
  const { vaultStatus, unlockVault, resetVault, biometricsEnabled } = useVault()

  const isInTab = getUiType().isTab
  const { getApproval } = useExtensionApproval()
  const { extensionWallet } = useExtensionWallet()

  const loadView = useCallback(async () => {
    if (vaultStatus === VAULT_STATUS.LOADING) return

    if (isInNotification && !approval) {
      window.close()
      return
    }

    if (vaultStatus === VAULT_STATUS.NOT_INITIALIZED) {
      return navigate('/get-started')
    }

    if (vaultStatus === VAULT_STATUS.LOCKED) {
      return navigate('/unlock-vault')
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return navigate('/auth')
    }

    // TODO:
    // if ((await extensionWallet.hasPageStateCache()) && !isInNotification && !isInTab && !approval) {
    //   const cache = (await extensionWallet.getPageStateCache())!
    //   setTo(cache.path + (cache.search || ''))
    //   return
    // }
    if (approval && isInNotification) {
      if (approval?.data?.approvalComponent === 'PermissionRequest') {
        return navigate('permission-request')
      }
      if (approval?.data?.approvalComponent === 'SendTransaction') {
        return navigate('pending-transactions')
      }
      if (approval?.data?.approvalComponent === 'SignText') {
        return navigate('sign-message')
      }
      if (approval?.data?.approvalComponent === 'SignTypedData') {
        return navigate('sign-message')
      }
      if (approval?.data?.approvalComponent === 'SwitchNetwork') {
        return navigate('switch-network')
      }
      if (approval?.data?.approvalComponent === 'WalletWatchAsset') {
        return navigate('watch-asset')
      }
    } else {
      navigate('/dashboard')
    }
  }, [isInNotification, vaultStatus, approval, navigate, authStatus])

  useEffect(() => {
    loadView()
  }, [loadView])

  return (
    <View style={[StyleSheet.absoluteFill, flexbox.center]}>
      <Spinner />
    </View>
  )
}

export default Router
