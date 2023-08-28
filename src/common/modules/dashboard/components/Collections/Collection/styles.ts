import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  image: ImageStyle
  imageAndName: ViewStyle
  name: TextStyle
  network: ViewStyle
  networkName: TextStyle
  networkIcon: ImageStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.justifySpaceBetween,
    ...flexbox.alignCenter,
    borderRadius: 12,
    padding: SPACING_MI,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  image: { width: 30, height: 30, borderRadius: 12 },
  imageAndName: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  name: spacings.mlTy,
  network: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  networkIcon: { width: 25, height: 25 },
  networkName: spacings.mrMi
})

export default styles
