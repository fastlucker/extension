import { FC, useCallback } from 'react'
import { Pressable, View } from 'react-native'

import { Action, Banner as BannerType } from '@ambire-common/interfaces/banner'
import EditIcon from '@common/assets/svg/EditIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getUiType } from '@web/utils/uiType'

import styles from './styles'

const isTab = getUiType().isTab

const Banner: FC<BannerType> = ({ topic, title, text, actions = [] }) => {
  const { dispatch } = useBackgroundService()

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
    },
    [dispatch, topic]
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}>
          {/* icon */}
          <EditIcon width={22} height={22} />
        </View>
        <View style={styles.contentInner}>
          <Text style={styles.title} fontSize={isTab ? 15 : 13} weight="medium">
            {title}
          </Text>
          <Text fontSize={13} weight="regular">
            {text}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {actions.map((action) => (
          <Pressable
            key={action.actionName}
            style={styles.action}
            onPress={() => handleActionPress(action)}
          >
            <Text color={colors.violet} fontSize={14} weight="regular">
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default Banner
