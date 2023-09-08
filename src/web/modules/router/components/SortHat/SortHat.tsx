import { networks } from 'ambire-common/src/consts/networks'
import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import Spinner from '@common/components/Spinner'
import useNavigation from '@common/hooks/useNavigation'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { ROUTES } from '@common/modules/router/constants/common'
import flexbox from '@common/styles/utils/flexbox'
import permission from '@web/extension-services/background/services/permission'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'
import { getUiType } from '@web/utils/uiType'

const SortHat = () => {
  const { authStatus } = useAuth()
  const { navigate } = useNavigation()
  const { isNotification } = getUiType()
  const { onboardingStatus } = useOnboarding()
  const keystoreState = useKeystoreControllerState()
  const notificationState = useNotificationControllerState()
  const loadView = useCallback(async () => {
    if (isNotification && !notificationState.currentDappNotificationRequest) {
      window.close()
      return
    }

    if (keystoreState.isReadyToStoreKeys && !keystoreState.isUnlocked) {
      return navigate(ROUTES.keyStoreUnlock)
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return navigate(ROUTES.getStarted)
    }

    if (isNotification && notificationState.currentDappNotificationRequest) {
      if (notificationState.currentDappNotificationRequest?.screen === 'PermissionRequest') {
        return navigate(ROUTES.permissionRequest)
      }
      if (notificationState.currentDappNotificationRequest?.screen === 'SendTransaction') {
        const accountAddr = notificationState.currentDappNotificationRequest.params.data[0].from

        await permission.init()
        const chainId = Number(
          permission.getConnectedSite(
            notificationState.currentDappNotificationRequest.params.session.origin
          )?.chainId
        )
        const network = networks.find((n) => Number(n.chainId) === chainId)

        if (accountAddr && network) {
          return navigate(ROUTES.signAccountOp, {
            state: {
              accountAddr,
              network
            }
          })
        }
        // TODO: add here some error handling and dispatch dapp request removal
      }
      if (notificationState.currentDappNotificationRequest?.screen === 'SignText') {
        return navigate(ROUTES.signMessage)
      }
      if (notificationState.currentDappNotificationRequest?.screen === 'SignTypedData') {
        return navigate(ROUTES.signMessage)
      }
      if (notificationState.currentDappNotificationRequest?.screen === 'WalletWatchAsset') {
        return navigate(ROUTES.watchAsset)
      }
      if (notificationState.currentDappNotificationRequest?.screen === 'GetEncryptionPublicKey') {
        return navigate(ROUTES.getEncryptionPublicKeyRequest)
      }
    } else {
      navigate(
        onboardingStatus === ONBOARDING_VALUES.ON_BOARDED ? ROUTES.dashboard : ROUTES.onboarding
      )
    }
  }, [
    isNotification,
    notificationState.currentDappNotificationRequest,
    authStatus,
    navigate,
    onboardingStatus,
    keystoreState
  ])

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
