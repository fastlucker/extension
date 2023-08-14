import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import commonStyles from '@common/styles/utils/common'

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
    zIndex: 9,
    ...spacings.pbSm,
    flexDirection: 'row',
    backgroundColor: colors.wooed,
    alignItems: 'center',
    ...spacings.ph,
    ...(isWeb ? { height: 80 } : {})
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
    paddingVertical: 7,
    ...spacings.phTy
  },
  switcherContainer: {
    backgroundColor: colors.valhalla,
    height: 50,
    borderRadius: 13,
    ...spacings.plTy,
    ...spacings.prSm,
    ...spacings.mlTy,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  networkIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.clay,
    ...commonStyles.borderRadiusPrimary
  }
})

export default styles
