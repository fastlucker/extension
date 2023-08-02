import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  indicator: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...spacings.mbTy,
    alignItems: 'center'
  },
  indicator: {
    width: 3,
    height: '100%',
    ...spacings.mlTy,
    ...spacings.mrTy,
    borderRadius: 6
  }
})

export default styles
