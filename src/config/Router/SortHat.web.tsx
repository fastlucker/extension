import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useExtensionWallet from '@modules/common/hooks/useExtensionWallet'
import useNavigation from '@modules/common/hooks/useNavigation'
import useNetInfo from '@modules/common/hooks/useNetInfo'
import flexbox from '@modules/common/styles/utils/flexbox'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import { getUiType } from '@web/utils/uiType'

import { ROTES } from './routesConfig'

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
      return navigate(ROTES.getStarted)
    }

    if (vaultStatus === VAULT_STATUS.LOCKED) {
      return navigate(ROTES.unlockVault)
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return navigate(ROTES.auth)
    }

    // TODO:
    // if ((await extensionWallet.hasPageStateCache()) && !isInNotification && !isInTab && !approval) {
    //   const cache = (await extensionWallet.getPageStateCache())!
    //   setTo(cache.path + (cache.search || ''))
    //   return
    // }
    if (approval && isInNotification) {
      if (approval?.data?.approvalComponent === 'PermissionRequest') {
        return navigate(ROTES.permissionRequest)
      }
      if (approval?.data?.approvalComponent === 'SendTransaction') {
        return navigate(ROTES.pendingTransactions)
      }
      if (approval?.data?.approvalComponent === 'SignText') {
        return navigate(ROTES.signMessage)
      }
      if (approval?.data?.approvalComponent === 'SignTypedData') {
        return navigate(ROTES.signMessage)
      }
      if (approval?.data?.approvalComponent === 'SwitchNetwork') {
        return navigate(ROTES.switchNetwork)
      }
      if (approval?.data?.approvalComponent === 'WalletWatchAsset') {
        return navigate(ROTES.watchAsset)
      }
      if (approval?.data?.approvalComponent === 'GetEncryptionPublicKey') {
        return navigate(ROTES.getEncryptionPublicKeyRequest)
      }
    } else {
      navigate(ROTES.dashboard)
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
