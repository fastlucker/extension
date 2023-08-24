import React from 'react'
import { Pressable, ViewStyle, View } from 'react-native'
import flexbox from '@common/styles/utils/flexbox'
import styles from './styles'

interface Props {
  children: React.ReactNode
  onPress: () => void
  style?: ViewStyle
}

const FeeWrapper = ({ children, onPress, style }: Props) => (
  <Pressable style={[flexbox.flex1, style]} onPress={onPress}>
    {({ hovered }: any) => (
      <View style={[styles.container, hovered && styles.containerHover]}>{children}</View>
    )}
  </Pressable>
)

export default FeeWrapper
