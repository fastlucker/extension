import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  backgroundSVG: ViewStyle
  headerContainer: ViewStyle
  title: ViewStyle
  // contentContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      width: 400,
      height: 380,
      backgroundColor: theme.primaryBackground,
      // TODO:
      // ...flexbox.alignCenter,
      // TODO: Remove?
      marginHorizontal: 'auto',
      // overflow: 'hidden',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#CACDE6',
      ...spacings.phXl,
      borderBottomLeftRadius: BORDER_RADIUS_PRIMARY,
      borderBottomRightRadius: BORDER_RADIUS_PRIMARY
    },
    headerContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: 400,
      height: 240,
      borderTopLeftRadius: BORDER_RADIUS_PRIMARY,
      borderTopRightRadius: BORDER_RADIUS_PRIMARY,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderTopWidth: 1,
      borderColor: '#CACDE6',
      overflow: 'hidden'
    },
    backgroundSVG: {
      position: 'absolute',
      zIndex: -1
    },
    title: {
      fontSize: 32,
      textAlign: 'center',
      ...spacings.mvXl
    }
    // TODO:
    // contentContainer: {
    //   paddingVertical: SPACING_XL + SPACING_TY,
    //   ...spacings.phXl,
    //   backgroundColor: theme.primaryBackground,
    //   ...flexbox.flex1
    // },
  })

export default getStyles
