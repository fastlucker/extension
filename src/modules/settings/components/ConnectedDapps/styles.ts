import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  image: ImageStyle
  placeholderImage: ViewStyle
}

const styles = StyleSheet.create<Style>({
  image: {
    ...spacings.mrTy,
    width: 36,
    height: 36
  },
  placeholderImage: {
    ...spacings.mrTy,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    opacity: 0.3,
    borderRadius: 50,
    overflow: 'hidden'
  }
})

export default styles
