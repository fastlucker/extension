import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  text: TextStyle
  iconWrapper: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: 290,
    minHeight: 368,
    backgroundColor: colors.melrose_15,
    ...flexbox.alignCenter,
    ...common.borderRadiusPrimary,
    ...spacings.phSm,
    ...spacings.pbSm,
    ...spacings.ptLg
  },
  text: {
    textAlign: 'center'
  },
  iconWrapper: {
    height: 96,
    ...flexbox.alignCenter,
    ...flexbox.justifyCenter
  }
})

export default styles
