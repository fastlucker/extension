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
  children?: React.ReactNode
  size?: 'sm' | 'md'
}

const ICON_MAP = {
  error: ErrorIcon,
  warning: WarningIcon,
  success: SuccessIcon,
  info: InfoIcon
}

const Alert: FC<Props> = ({ title, text, type = 'info', style, children, size = 'md' }) => {
  const Icon = ICON_MAP[type]
  const { theme } = useTheme()
  const isSmall = size === 'sm'
  const fontSize = !isSmall ? 16 : 14

  return (
    <View
      style={[
        !isSmall ? spacings.ph : spacings.phSm,
        !isSmall ? spacings.pv : spacings.pvSm,
        flexbox.directionRow,
        common.borderRadiusPrimary,
        { backgroundColor: theme[`${type}Background`] },
        style
      ]}
    >
      <Icon
        width={!isSmall ? 20 : 16}
        height={!isSmall ? 20 : 16}
        color={theme[`${type}Decorative`]}
      />
      <View style={[!isSmall ? spacings.ml : spacings.mlTy, flexbox.flex1]}>
        <Text style={text ? spacings.mbTy : {}}>
          <Text
            appearance={`${type}Text`}
            fontSize={fontSize}
            weight="semiBold"
            style={{ textTransform: 'capitalize' }}
          >
            {type}:{' '}
          </Text>
          <Text appearance={`${type}Text`} fontSize={fontSize} weight="regular">
            {title}
          </Text>
        </Text>
        {text && (
          <Text fontSize={fontSize} weight="regular" appearance={`${type}Text`}>
            {text}
          </Text>
        )}
      </View>
      {children}
    </View>
  )
}

export default Alert
