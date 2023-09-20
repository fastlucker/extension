import { Platform, StyleSheet, TextStyle, ViewStyle } from 'react-native'

import { isWeb } from '@common/config/env'
import colors from '@common/styles/colors'
import spacings, { SPACING } from '@common/styles/spacings'
import commonWebStyles from '@web/styles/utils/common'

export const HEADER_HEIGHT = Platform.select({
  web: 90,
  default: 60
})

interface Styles {
  container: ViewStyle
  containerInner: ViewStyle
  navIconContainerRegular: ViewStyle
  title: TextStyle
  sideContainer: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    zIndex: 9,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.zircon,
    ...spacings.ph,
    ...spacings.pv,
    ...(isWeb ? { height: 90 } : {})
  },
  containerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    ...commonWebStyles.contentContainer
  },
  navIconContainerRegular: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    flex: 1,
    ...spacings.phTy
  },
  sideContainer: {
    width: isWeb ? 180 : 120,
    minWidth: isWeb ? 180 : 120
  }
})

export default styles
