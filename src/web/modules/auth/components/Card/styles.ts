import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: 290,
    minHeight: 368,
    backgroundColor: colors.melrose_15,
    ...flexbox.alignCenter,
    ...common.borderRadiusPrimary,
    ...spacings.phSm,
    ...spacings.pvSm
  },
  text: {
    textAlign: 'center'
  }
})

export default styles
