import { ImageProps, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'

interface Style {
  itemContainer: ViewStyle
  imageStyle: ImageProps
}

const styles = StyleSheet.create<Style>({
  itemContainer: {
    ...spacings.ph,
    ...spacings.pv,
    ...common.borderRadiusPrimary,
    height: 368,
    textAlign: 'center',
    alignItems: 'stretch'
  },
  imageStyle: {
    height: 136,
    width: 120,
    marginBottom: 27,
    alignSelf: 'center'
  }
})

export default styles
