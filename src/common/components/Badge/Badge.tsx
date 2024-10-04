import React from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import InformationIcon from '@common/assets/svg/InformationIcon'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'
import { Props } from './types'

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
  },
  ok: {
    color: theme.secondaryText,
    iconColor: theme.successText
  }
})

const Badge = ({
  text,
  tooltipText,
  withRightSpacing,
  type = 'default',
  style,
  nativeID,
  children
}: Props) => {
  const { styles, theme } = useTheme(getStyles)
  const badgeTypes = getBadgeTypes(theme)
  const { color, iconColor } = badgeTypes[type]
  const tooltipId = uuidv4()

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
        !!tooltipText && spacings.prMi,
        style
      ]}
      nativeID={nativeID}
    >
      <Text weight="regular" fontSize={10} color={color} style={[spacings.mrMi]}>
        {text}
      </Text>
      {children}
      {!!tooltipText && (
        <>
          <InformationIcon data-tooltip-id={tooltipId} color={iconColor} width={14} height={14} />
          <Tooltip id={tooltipId} content={tooltipText} />
        </>
      )}
    </View>
  )
}

export default React.memo(Badge)
