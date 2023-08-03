import React, { ReactNode } from 'react'
import { TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import commonStyles from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Props extends TouchableOpacityProps {
  children: ReactNode
  onPress: () => any
  style?: ViewStyle
}

const HIT_SLOP = { bottom: 10, left: 10, right: 10, top: 10 }

const NavIconWrapper = ({ children, onPress, style, ...rest }: Props) => {
  return (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        backgroundColor: colors.melrose_15,
        borderWidth: 1,
        borderColor: colors.melrose_15,
        ...commonStyles.borderRadiusPrimary,
        ...flexbox.alignCenter,
        ...flexbox.justifyCenter,
        ...style
      }}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  )
}

export default NavIconWrapper
