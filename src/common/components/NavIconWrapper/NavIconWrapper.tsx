import React, { ReactNode } from 'react'
import { ColorValue, Pressable, View, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Props {
  children: ReactNode
  onPress: () => any
  hoverBackground?: ColorValue
  hoverColor?: ColorValue
  hoverBorderColor?: ColorValue
  style?: ViewStyle
  width?: number
  height?: number
}

const NavIconWrapper = ({
  children,
  onPress,
  style,
  hoverBackground,
  hoverColor,
  width = 40,
  height = 40,
  hoverBorderColor,
  ...rest
}: Props) => {
  const childrenArray = React.Children.toArray(children)
  return (
    <Pressable onPress={onPress} {...rest}>
      {({ hovered }: any) => (
        <View
          style={{
            width,
            height,
            borderWidth: 1,
            ...commonStyles.borderRadiusPrimary,
            ...flexbox.alignCenter,
            ...flexbox.justifyCenter,
            overflow: 'hidden',
            ...style,
            borderColor:
              hovered && hoverBorderColor
                ? hoverBorderColor
                : style?.borderColor || colors.melrose_15,
            backgroundColor:
              hovered && hoverBackground
                ? hoverBackground
                : style?.backgroundColor || colors.melrose_15
          }}
        >
          {/* TODO: This way may not be the best to fix this. Will need to think about this */}
          {childrenArray.map((child) => {
            if (React.isValidElement(child)) {
              // Clone the SVG element and store its ref for updating styles directly.
              return React.cloneElement(child, {
                ...child.props,
                color: hovered && hoverColor ? hoverColor : child.props.color
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
