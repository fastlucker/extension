import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  headerLeft: ViewStyle
  headerLeftText: TextStyle
  title: TextStyle
  navIconContainerRegular: ViewStyle
  sideContainer: ViewStyle
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
    flex: 1
  },
  navIconContainerRegular: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sideContainer: {
    width: isWeb ? 180 : 120,
    minWidth: isWeb ? 180 : 120
  }
})

export default styles
