import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  headerLeft: ViewStyle
  headerLeftText: TextStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.zircon,
    ...spacings.ph,
    ...spacings.pv
  },
  headerLeft: { ...flexbox.directionRow, ...flexbox.alignCenter },
  headerLeftText: spacings.mlTy,
  title: {
    color: colors.martinique,
    textAlign: 'center',
    flex: 1,
    ...spacings.pl
  }
})

export default styles
