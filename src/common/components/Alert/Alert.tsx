import React, { FC } from 'react'
import { View, ViewStyle } from 'react-native'

import ErrorIcon from '@common/assets/svg/ErrorIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

import Text from '../Text'

interface Props {
  title: string
  text?: string
  type?: 'error' | 'warning' | 'success' | 'info'
  style?: ViewStyle
}

const ICON_MAP = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

const Alert: FC<Props> = ({ title, text, type = 'info', style }) => {
  const Icon = ICON_MAP[type]
  const { theme } = useTheme()

  return (
    <View
      style={[
        spacings.ph,
        spacings.pv,
        flexbox.directionRow,
        common.borderRadiusPrimary,
        { backgroundColor: theme[`${type}Background`] },
        style
      ]}
    >
      <Icon width={20} height={20} color={theme[`${type}Decorative`]} />
      <View style={spacings.ml}>
        <Text style={text ? spacings.mbTy : {}}>
          <Text
            appearance={`${type}Text`}
            fontSize={16}
            weight="semiBold"
            style={{ textTransform: 'capitalize' }}
          >
            {type}:{' '}
          </Text>
          <Text appearance={`${type}Text`} fontSize={16} weight="regular">
            {title}
          </Text>
        </Text>
        {text && (
          <Text weight="regular" appearance={`${type}Text`}>
            {text}
          </Text>
        )}
      </View>
    </View>
  )
}

export default Alert
