/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { FC, useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Action, Banner as BannerType } from '@ambire-common/interfaces/banner'
import ErrorIcon from '@common/assets/svg/ErrorIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getUiType } from '@web/utils/uiType'

import RPCSelectBottomSheet from './RPCSelectBottomSheet'
import getStyles from './styles'

const isTab = getUiType().isTab

const ERROR_ACTIONS = ['reject-accountOp']

const ICON_MAP = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

const DashboardBanner: FC<BannerType> = ({ type, title, text, actions = [] }) => {
  const { styles, theme } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()
  const { navigate } = useNavigation()
  const { visibleActionsQueue } = useActionsControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const Icon = ICON_MAP[type]

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

  return (
    <View style={[styles.container, { backgroundColor: theme[`${type}Background`] }]}>
      <View style={[styles.content, { borderLeftColor: theme[`${type}Decorative`] }]}>
        <View style={[spacings.mrSm]}>
          <Icon width={20} height={20} color={theme[`${type}Decorative`]} />
        </View>

        <View style={[flexbox.wrap, flexbox.flex1]}>
          <Text appearance="primaryText" fontSize={isTab ? 16 : 14} weight="medium">
            {title}
          </Text>
          <Text fontSize={isTab ? 14 : 12} weight="regular" appearance="secondaryText">
            {text}
          </Text>
        </View>
      </View>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        {actions.map((action) => {
          const isReject = ERROR_ACTIONS.includes(action.actionName)

          return (
            <Button
              key={action.actionName}
              size="small"
              text={action.label}
              textUnderline={isReject}
              textStyle={isReject && { color: theme.errorDecorative }}
              style={[spacings.mlTy, spacings.ph, isReject && { borderWidth: 0 }, { minWidth: 80 }]}
              hasBottomSpacing={false}
              onPress={() => handleActionPress(action)}
              type={isReject ? 'ghost' : 'primary'}
              submitOnEnter={false}
            />
          )
        })}
      </View>
      <RPCSelectBottomSheet
        actions={actions}
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        isVisible={withRpcUrlSelectBottomSheet}
      />
    </View>
  )
}

export default React.memo(DashboardBanner)
