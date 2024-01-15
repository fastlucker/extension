import React from 'react'
import { View, ViewStyle } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import InformationIcon from '@common/assets/svg/InformationIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type Props = {
  text: string
  type?: 'info' | 'warning' | 'default' | 'success'
  withIcon?: boolean
  style?: ViewStyle
  withRightSpacing?: boolean
}

const getBadgeTypes = (theme: ThemeProps) => ({
  info: {
    color: theme.infoText,
    iconColor: theme.infoDecorative
  },
  default: {
    color: theme.secondaryText,
    iconColor: theme.secondaryText
  },
  success: {
    color: theme.successText,
    iconColor: theme.successDecorative
  },
  warning: {
    color: theme.warningText,
    iconColor: theme.warningDecorative
  }
})

const Badge = ({ text, withIcon, withRightSpacing, type = 'default', style }: Props) => {
  const { styles, theme } = useTheme(getStyles)
  const badgeTypes = getBadgeTypes(theme)
  const { color, iconColor } = badgeTypes[type]

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        type === 'success' && styles.successBadge,
        type === 'default' && styles.defaultBadge,
        type === 'warning' && styles.warningBadge,
        type === 'info' && styles.infoBadge,
        {
          height: 20
        },
        withRightSpacing && spacings.mrSm,
        withIcon && spacings.prMi,
        style
      ]}
    >
      <Text weight="regular" fontSize={10} color={color} style={spacings.mrMi}>
        {text}
      </Text>
      {withIcon && <InformationIcon color={iconColor} width={14} height={14} />}
    </View>
  )
}

export default Badge
