import React, { FC, useCallback, useMemo } from 'react'
import { useModalize } from 'react-native-modalize'

import { Action, Banner as BannerType } from '@ambire-common/interfaces/banner'
import CartIcon from '@common/assets/svg/CartIcon'
import ErrorIcon from '@common/assets/svg/ErrorIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import PendingToBeConfirmedIcon from '@common/assets/svg/PendingToBeConfirmedIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Banner from '@common/components/Banner'
import useNavigation from '@common/hooks/useNavigation'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

import RPCSelectBottomSheet from './RPCSelectBottomSheet'

const ERROR_ACTIONS = ['reject-accountOp']

const ICON_MAP = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

const DashboardBanner: FC<BannerType> = ({ type, category, title, text, actions = [] }) => {
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const { visibleActionsQueue } = useActionsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const Icon = useMemo(() => {
    if (category === 'pending-to-be-signed-acc-op') return CartIcon
    if (category === 'pending-to-be-confirmed-acc-op') return PendingToBeConfirmedIcon

    return ICON_MAP[type]
  }, [type, category])

  const withRpcUrlSelectBottomSheet = useMemo(
    () => !!actions.filter((a) => a.actionName === 'select-rpc-url').length,
    [actions]
  )

  const handleOpenBottomSheet = useCallback(() => {
    if (withRpcUrlSelectBottomSheet) {
      openBottomSheet()
    }
  }, [openBottomSheet, withRpcUrlSelectBottomSheet])

  const handleActionPress = useCallback(
    (action: Action) => {
      if (action.actionName === 'open-pending-dapp-requests') {
        if (!visibleActionsQueue) return
        const dappActions = visibleActionsQueue.filter((a) => a.type !== 'accountOp')
        dispatch({
          type: 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID',
          params: { actionId: dappActions[0].id }
        })
      }
      if (action.actionName === 'open-accountOp') {
        dispatch({
          type: 'ACTIONS_CONTROLLER_SET_CURRENT_ACTION_BY_ID',
          params: action.meta
        })
      }

      if (action.actionName === 'reject-accountOp') {
        dispatch({
          type: 'MAIN_CONTROLLER_REJECT_ACCOUNT_OP',
          params: action.meta
        })
      }

      if (action.actionName === 'open-external-url' && type === 'success') {
        window.open(action.meta.url, '_blank')
      }

      if (action.actionName === 'switch-default-wallet') {
        dispatch({
          type: 'SET_IS_DEFAULT_WALLET',
          params: { isDefaultWallet: true }
        })
        addToast('Ambire is your default wallet.', { timeout: 2000 })
      }

      if (action.actionName === 'sync-keys' && type === 'info') {
        dispatch({
          type: 'EMAIL_VAULT_CONTROLLER_REQUEST_KEYS_SYNC',
          params: { email: action.meta.email, keys: action.meta.keys }
        })
      }

      if (action.actionName === 'backup-keystore-secret') {
        navigate(ROUTES.devicePasswordRecovery)
      }

      if (action.actionName === 'select-rpc-url') {
        handleOpenBottomSheet()
      }
    },
    [visibleActionsQueue, dispatch, addToast, navigate, handleOpenBottomSheet, type]
  )

  const renderButtons = useMemo(
    () =>
      actions.map((action) => {
        const isReject = ERROR_ACTIONS.includes(action.actionName)

        return (
          <Banner.Button
            key={action.actionName}
            isReject={isReject}
            text={action.label}
            onPress={() => handleActionPress(action)}
          />
        )
      }),
    [actions, handleActionPress]
  )

  return (
    <Banner CustomIcon={Icon} title={title} type={type} text={text} renderButtons={renderButtons}>
      <RPCSelectBottomSheet
        actions={actions}
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        isVisible={withRpcUrlSelectBottomSheet}
      />
    </Banner>
  )
}

export default React.memo(DashboardBanner)
