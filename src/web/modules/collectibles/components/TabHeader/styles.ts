import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings, { SPACING_LG } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  tabheader: ViewStyle
  tabheaderInner: ViewStyle
  tabheaderTitle: TextStyle
  tabheaderContent: ViewStyle
  headerLeft: ViewStyle
}

const styles = StyleSheet.create<Style>({
  tabheader: {
    backgroundColor: colors.zircon,
    ...spacings.pvMd,
    ...spacings.phLg
  },
  tabheaderInner: {
    ...flexbox.directionRow,
    position: 'relative',
    ...commonWebStyles.contentContainer
  },
  headerLeft: {
    left: 0,
    position: 'absolute',
    zIndex: 5
  },
  tabheaderContent: {
    ...flexbox.directionRow,
    ...flexbox.flex1,
    ...flexbox.justifyCenter,
    ...flexbox.alignCenter
  },
  tabheaderTitle: {
    ...spacings.mlSm
  }
})

export default styles
