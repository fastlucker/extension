import React from 'react'
import { Animated, Pressable } from 'react-native'

import { FeeSpeed } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  label: string
  type: FeeSpeed
  amountUsd: number
  onPress: (fee: FeeSpeed) => void
  isSelected: boolean
  disabled: boolean
}

const Fee = ({ label, type, amountUsd, onPress, isSelected, disabled }: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const { minWidthSize } = useWindowSize()
  const [bindAnim, animStyle] = useCustomHover({
    property: 'borderColor',
    values: {
      from: theme.secondaryBorder,
      to: theme.primary
    },
    forceHoveredStyle: isSelected
  })

  return (
    <Pressable
      style={[
        styles.container,
        minWidthSize('l') && {
          minWidth: '50%',
          maxWidth: '50%'
        }
      ]}
      disabled={disabled}
      onPress={() => onPress(type)}
      testID={`fee-${label.toLowerCase()}`}
      {...bindAnim}
    >
      <Animated.View
        style={[
          styles.containerInner,
          minWidthSize('l') && { ...flexbox.directionRow, ...flexbox.justifySpaceBetween },
          animStyle,
          ...[disabled ? [styles.disabled] : []]
        ]}
      >
        <Text
          weight="medium"
          fontSize={12}
          appearance={isSelected ? 'primary' : 'secondaryText'}
          style={minWidthSize('l') && spacings.mrTy}
        >
          {label}
        </Text>
        <Text
          fontSize={minWidthSize('m') ? 12 : 14}
          numberOfLines={1}
          weight="medium"
          color={isSelected ? theme.primary : theme.primaryText}
        >
          {formatDecimals(amountUsd, 'value')}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

export default React.memo(Fee)
