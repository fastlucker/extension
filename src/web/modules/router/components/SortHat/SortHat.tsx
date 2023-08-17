import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import useNavigation from '@common/hooks/useNavigation'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { ROUTES } from '@common/modules/router/constants/common'
import flexbox from '@common/styles/utils/flexbox'
import useApproval from '@web/hooks/useApproval'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'
import { getUiType } from '@web/utils/uiType'

const SortHat = () => {
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()
  const { approval } = useApproval()
  const { isNotification } = getUiType()
  const { onboardingStatus } = useOnboarding()
  const keystoreState = useKeystoreControllerState()

  const loadView = useCallback(async () => {
    if (isNotification && !approval) {
      window.close()
      return
    }

    if (keystoreState.isReadyToStoreKeys && !keystoreState.isUnlocked) {
      return navigate(ROUTES.unlockVault)
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return navigate(ROUTES.getStarted)
    }

    if (approval && isNotification) {
      if (approval?.data?.approvalComponent === 'PermissionRequest') {
        return navigate(ROUTES.permissionRequest)
      }
      if (approval?.data?.approvalComponent === 'SendTransaction') {
        return console.log(approval)
      }
      if (approval?.data?.approvalComponent === 'SignText') {
        return navigate(ROUTES.signMessage)
      }
      if (approval?.data?.approvalComponent === 'SignTypedData') {
        return navigate(ROUTES.signMessage)
      }
      // if (approval?.data?.approvalComponent === 'SwitchNetwork') {
      //   return navigate(ROUTES.switchNetwork)
      // }
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
  }, [isNotification, approval, authStatus, navigate, onboardingStatus, keystoreState])

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
