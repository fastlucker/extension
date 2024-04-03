import React from 'react'
import { Animated, Pressable } from 'react-native'

import { FeeSpeed } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  label: string
  type: FeeSpeed
  amount: string
  onPress: (fee: FeeSpeed) => void
  isSelected: boolean
  isLastItem: boolean
  disabled: boolean
}

const Fee = ({ label, type, amount, onPress, isSelected, isLastItem, disabled }: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const { minWidthSize, maxWidthSize } = useWindowSize()
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
        flexbox.flex1,
        maxWidthSize('xxl') && !isLastItem && spacings.mrTy,
        minWidthSize('xxl') && {
          minWidth: '50%',
          maxWidth: '50%',
          ...spacings.phMi,
          ...spacings.pvMi
        }
      ]}
      disabled={disabled}
      onPress={() => onPress(type)}
      testID={`fee-${label.toLowerCase()}`}
      {...bindAnim}
    >
      <Animated.View
        style={[
          styles.container,
          minWidthSize('xxl') && flexbox.directionRow,
          minWidthSize('xxl') && flexbox.justifySpaceBetween,
          minWidthSize('xxl') && flexbox.alignCenter,
          animStyle
        ]}
      >
        <Text
          weight="medium"
          fontSize={14}
          style={maxWidthSize('xxl') ? spacings.mbMi : spacings.mrTy}
          color={isSelected ? theme.primary : theme.primaryText}
        >
          {label}
        </Text>
        <Text
          fontSize={14}
          numberOfLines={1}
          weight="medium"
          color={isSelected ? theme.primary : theme.primaryText}
        >
          {amount}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

export default React.memo(Fee)
