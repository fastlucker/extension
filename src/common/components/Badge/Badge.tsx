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
  error: {
    color: theme.errorText,
    iconColor: theme.errorDecorative
  },
  ok: {
    color: theme.secondaryText,
    iconColor: theme.successText
  }
})

const SIZES = {
  sm: 1,
  md: 1.25,
  lg: 1.5
}

const Badge = ({
  text,
  weight,
  tooltipText,
  withRightSpacing,
  type = 'default',
  style,
  nativeID,
  children,
  size = 'sm'
}: Props) => {
  const { styles, theme } = useTheme(getStyles)
  const badgeTypes = getBadgeTypes(theme)
  const { color, iconColor } = badgeTypes[type]
  const tooltipId = uuidv4()
  const sizeMultiplier = SIZES[size]

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        type === 'success' && styles.successBadge,
        type === 'default' && styles.defaultBadge,
        type === 'warning' && styles.warningBadge,
        type === 'info' && styles.infoBadge,
        type === 'error' && styles.errorBadge,
        {
          height: sizeMultiplier * 20
        },
        withRightSpacing && spacings.mrSm,
        !!tooltipText && spacings.prMi,
        style
      ]}
      nativeID={nativeID}
    >
      {text && (
        <Text
          weight={weight || 'regular'}
          fontSize={sizeMultiplier * 10}
          color={color}
          style={[!!tooltipText && spacings.mrMi]}
        >
          {text}
        </Text>
      )}
      {children}
      {!!tooltipText && (
        <>
          <InformationIcon
            data-tooltip-id={tooltipId}
            color={iconColor}
            width={sizeMultiplier * 14}
            height={sizeMultiplier * 14}
          />
          <Tooltip id={tooltipId} content={tooltipText} />
        </>
      )}
    </View>
  )
}

export default React.memo(Badge)
