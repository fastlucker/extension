import React, { ReactNode } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface Props extends TouchableOpacityProps {
  children: ReactNode
  onPress: () => any
}

const HIT_SLOP = { bottom: 10, left: 10, right: 10, top: 10 }

const NavIconWrapper = ({ children, onPress, ...rest }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={HIT_SLOP} {...rest}>
      {children}
    </TouchableOpacity>
  )
}

export default NavIconWrapper
