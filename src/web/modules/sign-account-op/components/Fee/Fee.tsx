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
  isViewOnly: boolean
}

const Fee = ({ label, type, amount, onPress, isSelected, isLastItem, isViewOnly }: Props) => {
  const { theme, styles } = useTheme(getStyles)
  const { minWidthSize, maxWidthSize } = useWindowSize()

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
      disabled={isViewOnly}
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

export default React.memo(Fee)
