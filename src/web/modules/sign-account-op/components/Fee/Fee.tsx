import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

interface Props {
  label: string
  type: string
  amount: string
  onPress: (fee: string) => void
  isSelected: boolean
  isLastItem: boolean
}

const Fee = ({ label, type, amount, onPress, isSelected, isLastItem }: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const { minWidthSize, maxWidthSize } = useWindowSize()

  return (
    <Pressable
      style={
        maxWidthSize('xxl')
          ? [flexbox.flex1, !isLastItem && spacings.mrTy]
          : [flexbox.flex1, !isLastItem && spacings.mbTy]
      }
      onPress={() => onPress(type)}
    >
      {({ hovered }: any) => (
        <View
          style={[
            styles.container,
            minWidthSize('xxl') && flexbox.directionRow,
            minWidthSize('xxl') && flexbox.justifySpaceBetween,
            minWidthSize('xxl') && flexbox.alignCenter,
            (!!hovered || isSelected) && styles.active
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
        </View>
      )}
    </Pressable>
  )
}

export default Fee
