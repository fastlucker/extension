/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { FC, useCallback } from 'react'
import { View } from 'react-native'

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
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const isTab = getUiType().isTab

const ERROR_ACTIONS = ['reject']

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
  const Icon = ICON_MAP[type]

  const handleActionPress = useCallback(
    (action: Action) => {
      if (action.actionName === 'open' && type === 'info') {
        dispatch({
          type: 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST',
          params: { id: action.meta.ids[0] }
        })
      }

      if (action.actionName === 'reject' && type === 'info') {
        action.meta.ids.forEach((reqId: number) => {
          dispatch({
            type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
            params: { err: action.meta.err, id: reqId }
          })
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
        navigate(ROUTES.devicePassword)
      }
    },
    [dispatch, addToast, navigate, type]
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
            />
          )
        })}
      </View>
    </View>
  )
}

export default React.memo(DashboardBanner)
