import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'

interface Styles {
  container: ViewStyle
  title: TextStyle
  navIconContainerRegular: ViewStyle
  sideContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.zircon
  },
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
