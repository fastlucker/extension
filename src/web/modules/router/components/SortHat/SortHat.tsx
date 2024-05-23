import React, { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { AccountOpAction, BenzinAction } from '@ambire-common/controllers/actions/actions'
import { INVITE_STATUS } from '@ambire-common/controllers/invite/invite'
import Spinner from '@common/components/Spinner'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { AUTH_STATUS } from '@common/modules/auth/constants/authStatus'
import useAuth from '@common/modules/auth/hooks/useAuth'
import { ROUTES } from '@common/modules/router/constants/common'
import flexbox from '@common/styles/utils/flexbox'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useInviteControllerState from '@web/hooks/useInviteControllerState'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { getUiType } from '@web/utils/uiType'

const SortHat = () => {
  const { authStatus } = useAuth()
  const { inviteStatus } = useInviteControllerState()
  const { navigate } = useNavigation()
  const { isActionWindow } = getUiType()
  const keystoreState = useKeystoreControllerState()
  const actionsState = useActionsControllerState()
  const mainState = useMainControllerState()
  const { params } = useRoute()
  const { dispatch } = useBackgroundService()
  const { networks } = useSettingsControllerState()

  useEffect(() => {
    setTimeout(() => {
      if (isActionWindow && !actionsState.currentAction) {
        window.close()
      }
    }, 1500)
  }, [isActionWindow, actionsState.currentAction])

  const loadView = useCallback(async () => {
    if (keystoreState.isReadyToStoreKeys && !keystoreState.isUnlocked) {
      return navigate(ROUTES.keyStoreUnlock)
    }

    if (inviteStatus !== INVITE_STATUS.VERIFIED) {
      return navigate(ROUTES.inviteVerify)
    }

    if (authStatus === AUTH_STATUS.NOT_AUTHENTICATED) {
      return navigate(ROUTES.getStarted)
    }

    if (isActionWindow && actionsState.currentAction) {
      const actionType = actionsState.currentAction.type
      if (actionType === 'unlock') {
        dispatch({
          type: 'MAIN_CONTROLLER_RESOLVE_USER_REQUEST',
          params: { data: null, id: actionsState.currentAction.id }
        })
      }
      if (actionType === 'dappConnect') {
        return navigate(ROUTES.dappConnectRequest)
      }
      if (actionType === 'walletAddEthereumChain') {
        return navigate(ROUTES.addChain)
      }
      if (actionType === 'accountOp') {
        const accountOpAction = actionsState.currentAction as AccountOpAction

        const accountAddr = accountOpAction.accountOp.accountAddr
        const network = networks.filter((n) => n.id === accountOpAction.accountOp.networkId)[0]

        return navigate(ROUTES.signAccountOp, { state: { accountAddr, network } })
      }
      if (actionType === 'signMessage') {
        return navigate(ROUTES.signMessage, {
          state: {
            accountAddr:
              mainState.messagesToBeSigned[mainState.selectedAccount as string].accountAddr
          }
        })
      }

      if (actionType === 'walletWatchAsset') {
        return navigate(ROUTES.watchAsset)
      }
      if (actionType === 'ethGetEncryptionPublicKey') {
        return navigate(ROUTES.getEncryptionPublicKeyRequest)
      }
      if (actionType === 'benzin') {
        // if userOpHash and custom network, close the window
        // as jiffyscan may not support the network

        const benzinAction = actionsState.currentAction as BenzinAction
        let link = `${ROUTES.benzin}?networkId=${benzinAction.userRequest.meta?.networkId}&isInternal`
        if (benzinAction.userRequest.meta?.txnId) {
          link += `&txnId=${benzinAction.userRequest.meta?.txnId}`
        }
        if (benzinAction.userRequest.meta?.userOpHash) {
          link += `&userOpHash=${benzinAction.userRequest.meta?.userOpHash}`
        }
        return navigate(link)
      }
    } else if (params?.openOnboardingCompleted) {
      navigate(ROUTES.onboardingCompleted, { state: { validSession: true } })
    } else {
      navigate(ROUTES.dashboard)
    }
  }, [
    params?.openOnboardingCompleted,
    isActionWindow,
    actionsState.currentAction,
    authStatus,
    keystoreState,
    inviteStatus,
    mainState.selectedAccount,
    mainState.messagesToBeSigned,
    networks,
    navigate,
    dispatch
  ])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadView()
  }, [loadView])

  return (
    <View style={[StyleSheet.absoluteFill, flexbox.center]}>
      <Spinner />
    </View>
  )
}

export default React.memo(SortHat)
