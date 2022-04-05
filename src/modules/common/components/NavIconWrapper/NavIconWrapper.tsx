import React, { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'

type Props = {
  children: ReactNode
  onPress: () => any
}

const HIT_SLOP = { bottom: 10, left: 10, right: 10, top: 10 }

const NavIconWrapper = ({ children, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={HIT_SLOP}>
      {children}
    </TouchableOpacity>
  )
}

export default NavIconWrapper
