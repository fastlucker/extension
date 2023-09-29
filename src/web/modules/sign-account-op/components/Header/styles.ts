import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native'

import text from '@common/styles/utils/text'
import flexbox from '@common/styles/utils/flexbox'
import colors from '@common/styles/colors'

interface Style {
  container: ViewStyle
  image: ImageStyle
  addressContainer: ViewStyle
  address: TextStyle
  addressLabel: TextStyle
  network: ViewStyle
  networkText: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  image: {
    width: 46,
    height: 46,
    marginRight: 14,
    borderRadius: 12
  },
  addressContainer: {
    marginRight: 23
  },
  address: {
    ...text.left,
    color: colors.greenHaze
  },
  addressLabel: {
    ...text.left,
    color: colors.martinique
  },
  network: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  networkText: {
    color: colors.martinique_65
  }
})

export default styles
