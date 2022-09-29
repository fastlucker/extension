import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@config/env'
import colors from '@modules/common/styles/colors'
import commonStyles from '@modules/common/styles/utils/common'

export const HEADER_HEIGHT = Platform.select({
  web: 70,
  default: 60
})

interface Styles {
  container: ViewStyle
  navIconContainerRegular: ViewStyle
  navIconContainerSmall: ViewStyle
  title: TextStyle
  switcherContainer: ViewStyle
  networkIcon: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: colors.wooed,
    alignItems: 'center',
    paddingHorizontal: 20,
    ...(isWeb ? { maxHeight: 80 } : {})
  },
  navIconContainerRegular: {
    width: 40,
    alignItems: 'center'
  },
  navIconContainerSmall: {
    width: 24,
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    flex: 1,
    // So it is vertically aligned well with the nav buttons,
    // even when there are none.
    paddingVertical: 7
  },
  switcherContainer: {
    backgroundColor: colors.valhalla,
    height: 50,
    borderRadius: 13,
    paddingLeft: 10,
    paddingRight: 15,
    marginHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  networkIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.clay,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
