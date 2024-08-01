import React, { FC } from 'react'
import { View, ViewStyle } from 'react-native'

import useTheme from '@common/hooks/useTheme'
import { Portal } from '@gorhom/portal'

import getStyles from '../styles'

interface Props {
  menuRef: any
  menuProps: {
    x: number
    y: number
    height: number
    width: number
    maxDynamicHeight: number
    position: 'top' | 'bottom'
    windowHeight: number
  }
  children: React.ReactNode
  menuStyle?: ViewStyle
}

const MenuContainer: FC<Props> = ({
  menuRef,
  menuProps: { x, y, height, width, maxDynamicHeight, position, windowHeight },
  children,
  menuStyle
}) => {
  const { styles } = useTheme(getStyles)

  return (
    <Portal hostName="global">
      <View
        ref={menuRef}
        testID="select-menu"
        style={[
          styles.menuContainer,
          { width, maxHeight: maxDynamicHeight, left: x },
          position === 'bottom' && { top: y + height },
          position === 'top' && { bottom: windowHeight - y },
          menuStyle
        ]}
      >
        {children}
      </View>
    </Portal>
  )
}

export default MenuContainer
