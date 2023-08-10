import { StyleSheet, ViewStyle } from 'react-native'

import { FONT_FAMILIES } from '@common/hooks/useFonts'
// import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  text: ViewStyle
  bold: ViewStyle
  logo: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  text: {
    ...spacings.mb,
    fontSize: 14,
    fontFamily: FONT_FAMILIES.REGULAR,
    lineHeight: 21
  },
  bold: {
    fontFamily: FONT_FAMILIES.SEMI_BOLD
  },
  logo: {
    ...spacings.mbMd,
    ...flexbox.alignCenter
  }
})

export default styles
