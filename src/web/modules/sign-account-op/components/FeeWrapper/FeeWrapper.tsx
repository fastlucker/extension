import React from 'react'
import { Pressable, View, ViewStyle } from 'react-native'

import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'

interface Props {
  children: React.ReactNode
  type: string
  onPress: (type: string) => void
  style?: ViewStyle
  isSelected: boolean
}

const FeeWrapper = ({ children, type, onPress, style, isSelected }: Props) => {
  const { styles } = useTheme(getStyles)

  return (
    <Pressable style={[flexbox.flex1, style]} onPress={() => onPress(type)}>
      {({ hovered }: any) => (
        <View style={[styles.container, (!!hovered || isSelected) && styles.active]}>
          {children}
        </View>
      )}
    </Pressable>
  )
}

export default FeeWrapper
