import { StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native'

import text from '@common/styles/utils/text'
import flexbox from '@common/styles/utils/flexbox'
import colors from '@common/styles/colors'
import { FONT_FAMILIES } from '@common/hooks/useFonts'

interface Style {
  container: ViewStyle
  image: ImageStyle
  addressContainer: ViewStyle
  address: TextStyle
  addressLabel: TextStyle
  network: TextStyle
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
    color: colors.greenHaze,
    fontSize: 16
  },
  addressLabel: {
    ...text.left,
    color: colors.martinique,
    fontSize: 16,
    fontFamily: FONT_FAMILIES.SEMI_BOLD
  },
  network: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    display: 'flex',
    color: colors.martinique_65,
    fontSize: 14
  }
})

export default styles
