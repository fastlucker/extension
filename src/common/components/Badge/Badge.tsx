import React from 'react'
import { View } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type Props = {
  text: string
  type?: 'primary' | 'warning' | 'default' | 'success'
  withIcon?: boolean
}

const getBadgeTypes = (theme: ThemeProps) => ({
  primary: {
    color: theme.primary,
    iconColor: theme.primary
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

const Badge = ({ text, withIcon, type = 'default' }: Props) => {
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
        type === 'primary' && styles.primaryBadge
      ]}
    >
      <Text weight="regular" fontSize={12} color={color} style={spacings.mrMi}>
        {text}
      </Text>
      {withIcon && <InfoIcon color={iconColor} width={16} height={16} />}
    </View>
  )
}

export default Badge
