import React from 'react'
import { Pressable, View, ViewStyle } from 'react-native'

import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

interface Props {
  children: React.ReactNode
  onPress: () => void
  style?: ViewStyle
}

const FeeWrapper = ({ children, onPress, style }: Props) => {
  const { styles } = useTheme(getStyles)

  return (
    <Pressable style={[flexbox.flex1, style]} onPress={onPress}>
      {({ hovered }: any) => (
        <View style={[styles.container, !!hovered && styles.containerHover]}>{children}</View>
      )}
    </Pressable>
  )
}

export default FeeWrapper
