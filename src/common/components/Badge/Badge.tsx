import React from 'react'
import { View } from 'react-native'

import InfoIcon from '@common/assets/svg/InfoIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { legacyAccount } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

type Props = {
  text: string
  type?: 'primary' | 'warning' | 'default' | 'success'
  withIcon?: boolean
}

const Badge = ({ text, withIcon, type = 'default' }: Props) => {
  const { styles, theme } = useTheme(getStyles)

  const setColor = () => {
    if (type === 'success') return theme.successText
    if (type === 'default') return theme.secondaryText
    if (type === 'primary') return theme.primary
    return legacyAccount.primary
  }

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
      <Text fontSize={12} color={setColor()} style={spacings.mrMi}>
        {text}
      </Text>
      {withIcon && <InfoIcon color={setColor()} width={16} height={16} />}
    </View>
  )
}

export default Badge
