import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  backgroundSVG: ViewStyle
  headerContainer: ViewStyle
  // contentContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      width: 400,
      height: 380,
      backgroundColor: theme.secondaryBackground,
      // TODO:
      // ...flexbox.alignCenter,
      ...common.borderRadiusPrimary,
      // TODO: Remove?
      shadowColor: '#14183333',
      shadowOpacity: 1,
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowRadius: 16,
      marginHorizontal: 'auto',
      overflow: 'hidden',
      ...spacings.phXl
    },
    headerContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: 400,
      height: 216,
      borderTopLeftRadius: BORDER_RADIUS_PRIMARY,
      borderTopRightRadius: BORDER_RADIUS_PRIMARY,
      overflow: 'hidden'
    },
    backgroundSVG: {
      position: 'absolute',
      zIndex: -1
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
