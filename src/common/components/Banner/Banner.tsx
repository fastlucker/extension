import { FC, useCallback } from 'react'
import { View } from 'react-native'

import { Action, Banner as BannerType } from '@ambire-common/interfaces/banner'
import EditIcon from '@common/assets/svg/EditIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useNavigation from '@common/hooks/useNavigation'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getUiType } from '@web/utils/uiType'

import { ROUTES } from '@common/modules/router/constants/common'
import Button from '../Button'
import getStyles from './styles'

const isTab = getUiType().isTab

const ERROR_ACTIONS = ['reject']

const Banner: FC<BannerType> = ({ topic, title, text, actions = [] }) => {
  const { styles, theme } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { navigate } = useNavigation()

  const handleActionPress = useCallback(
    (action: Action) => {
      if (action.actionName === 'open' && topic === 'TRANSACTION') {
        dispatch({
          type: 'NOTIFICATION_CONTROLLER_OPEN_NOTIFICATION_REQUEST',
          params: { id: action.meta.ids[0] }
        })
      }

      if (action.actionName === 'reject' && topic === 'TRANSACTION') {
        action.meta.ids.forEach((reqId: number) => {
          dispatch({
            type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
            params: { err: action.meta.err, id: reqId }
          })
        })
      }

      if (action.actionName === 'open-external-url' && topic === 'TRANSACTION') {
        window.open(action.meta.url, '_blank')
      }

      if (action.actionName === 'sync-keys' && topic === 'ANNOUNCEMENT') {
        dispatch({
          type: 'EMAIL_VAULT_CONTROLLER_REQUEST_KEYS_SYNC',
          params: { email: action.meta.email, keys: action.meta.keys }
        })
      }

      if (action.actionName === 'backup-keystore-secret' && topic === 'WARNING') {
        navigate(ROUTES.keystore)
      }
    },
    [dispatch, topic]
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}>
          {/* icon */}
          {topic !== 'WARNING' ? (
            <EditIcon color={theme.primaryBackground} width={24} height={24} />
          ) : (
            <WarningIcon color={theme.primaryBackground} width={24} height={24} />
          )}
        </View>
        <View style={styles.contentInner}>
          <Text style={styles.title} fontSize={isTab ? 16 : 14} weight="medium">
            {title}
          </Text>
          <Text appearance="secondaryText" fontSize={isTab ? 14 : 12} weight="regular">
            {text}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {actions.map((action) => {
          const isReject = ERROR_ACTIONS.includes(action.actionName)

          return (
            <Button
              key={action.actionName}
              size="small"
              text={action.label}
              style={styles.action}
              onPress={() => handleActionPress(action)}
              type={isReject ? 'danger' : 'primary'}
            />
          )
        })}
      </View>
    </View>
  )
}

export default Banner
