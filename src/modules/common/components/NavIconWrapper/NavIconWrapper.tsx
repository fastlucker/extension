import React, { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'

import styles from './styles'

type Props = {
  children: ReactNode
  onPress: () => any
}

const NavIconWrapper = ({ children, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={onPress}
      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
    >
      {children}
    </TouchableOpacity>
  )
}

export default NavIconWrapper
