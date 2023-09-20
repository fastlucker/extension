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
  content: ViewStyle
  sideContainer: ViewStyle
  sideContainerRight: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    ...flexbox.directionRow,
    ...flexbox.alignCenter,
    ...spacings.ph,
    ...spacings.pv,
    height: isWeb ? 90 : 'auto'
  },
  headerLeft: { ...flexbox.directionRow, ...flexbox.alignCenter },
  headerLeftText: spacings.mlTy,
  content: {
    ...flexbox.directionRow,
    ...flexbox.flex1,
    ...flexbox.justifyCenter,
    ...flexbox.alignCenter
  },
  title: {
    color: colors.martinique,
    textAlign: 'center'
  },
  navIconContainerRegular: {
    width: 50,
    height: 50,
    ...flexbox.alignCenter,
    ...flexbox.justifyCenter
  },
  sideContainer: {
    width: isWeb ? 180 : 120,
    minWidth: isWeb ? 180 : 120,
    ...flexbox.directionRow,
    ...flexbox.alignCenter
  },
  sideContainerRight: {
    ...flexbox.justifyEnd
  }
})

export default styles
