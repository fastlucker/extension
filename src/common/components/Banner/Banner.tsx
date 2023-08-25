import { FC } from 'react'
import { Pressable, View } from 'react-native'

import EditIcon from '@common/assets/svg/EditIcon'
import colors from '@common/styles/colors'
import { getUiType } from '@web/utils/uiType'

import Text from '../Text'
import styles from './styles'

interface Props {
  title: string
  text: string
  isHideBtnShown?: boolean
  actions?: {
    label: string
    onPress: () => void
  }[]
}

const isTab = getUiType().isTab

const Banner: FC<Props> = ({ title, text, isHideBtnShown = true, actions = [] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}>
          {/* icon */}
          <EditIcon width={22} height={22} />
        </View>
        <View style={styles.contentInner}>
          <Text style={styles.title} fontSize={isTab ? 16 : 13} weight="medium">
            {title}
          </Text>
          <Text fontSize={14} weight="regular">
            {text}
          </Text>
        </View>
      </View>
      {actions.length > 0 &&
        actions.map(({ label, onPress }) => (
          <Pressable style={styles.action} onPress={onPress}>
            <Text color={colors.violet} fontSize={14} weight="regular">
              {label}
            </Text>
          </Pressable>
        ))}
      {isHideBtnShown && (
        <Text color={colors.violet} fontSize={14} weight="regular">
          Hide
        </Text>
      )}
    </View>
  )
}

export default Banner
