import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import Spinner from '@modules/common/components/Spinner'
import useExtensionApproval from '@modules/common/hooks/useExtensionApproval'
import useNavigation from '@modules/common/hooks/useNavigation'
import flexbox from '@modules/common/styles/utils/flexbox'
import { VAULT_STATUS } from '@modules/vault/constants/vaultStatus'
import useVault from '@modules/vault/hooks/useVault'
import { getUiType } from '@web/utils/uiType'

import { ROUTES } from './routesConfig'

const SortHat = () => {
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()
  const { approval } = useExtensionApproval()
  const isInNotification = getUiType().isNotification
  const { vaultStatus } = useVault()

  const isInTab = getUiType().isTab

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

    // TODO: check if needed when switching from popup to tab view
    // if ((await extensionWallet.hasPageStateCache()) && !isInNotification && !isInTab && !approval) {
    //   const cache = (await extensionWallet.getPageStateCache())!
    //   setTo(cache.path + (cache.search || ''))
    //   return
    // }
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
      navigate(ROUTES.dashboard)
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

export default SortHat
