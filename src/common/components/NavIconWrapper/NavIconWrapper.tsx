import React, { ReactNode } from 'react'
import { View, ViewStyle } from 'react-native'
import { Pressable } from 'react-native-web-hover'

import colors from '@common/styles/colors'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  children: ReactNode
  onPress: () => any
  hoveredBackground?: ViewStyle
  style?: ViewStyle
}

const NavIconWrapper = ({ children, onPress, style, hoveredBackground, ...rest }: Props) => {
  const childrenArray = React.Children.toArray(children)

  return (
    <Pressable onPress={onPress} {...rest}>
      {({ hovered }) => (
        <View
          style={{
            width: 50,
            height: 50,
            borderWidth: 1,
            borderColor: colors.melrose_15,
            ...commonStyles.borderRadiusPrimary,
            ...flexbox.alignCenter,
            ...flexbox.justifyCenter,
            ...style,
            backgroundColor: hovered && hoveredBackground ? hoveredBackground : colors.melrose_15
          }}
        >
          {/* TODO: This way may not be the best to fix this. Will need to think about this */}
          {childrenArray.map((child) => {
            if (React.isValidElement(child)) {
              // Clone the SVG element and store its ref for updating styles directly.
              return React.cloneElement(child, {
                color: hovered ? colors.white : colors.martinique
              })
            }
            return child
          })}
        </View>
      )}
    </Pressable>
  )
}

export default NavIconWrapper
