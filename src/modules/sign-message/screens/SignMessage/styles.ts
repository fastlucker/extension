import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  image: ImageStyle
  textarea: ViewStyle
}

const styles = StyleSheet.create<Style>({
  image: {
    ...spacings.mrTy,
    width: 20,
    height: 20
  },
  textarea: {
    minHeight: 220,
    flex: 1,
    backgroundColor: '#000',
    ...spacings.ph,
    ...spacings.pvSm,
    ...spacings.mbMd
  }
})

export default styles
