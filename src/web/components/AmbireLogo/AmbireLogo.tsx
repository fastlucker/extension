import React from 'react'
import { Image, View, ViewStyle } from 'react-native'

import logoSvg from '@web/components/AmbireLogo/logo.svg'

type Props = {
  style?: ViewStyle
}

const AmbireLogo: React.FC<Props> = ({ style }) => {
  return (
    <View style={style}>
      <Image source={logoSvg} style={{ width: 92.4, height: 33.1 }} resizeMode="contain" />
    </View>
  )
}

export default AmbireLogo
