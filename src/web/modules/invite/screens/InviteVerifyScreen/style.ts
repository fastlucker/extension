import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'

interface Styles {
  container: ViewStyle
  backgroundSVG: ViewStyle
  headerContainer: ViewStyle
  link: TextStyle
}

const CARD_WIDTH = 400

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      width: CARD_WIDTH,
      minHeight: 400,
      backgroundColor: theme.primaryBackground,
      marginHorizontal: 'auto',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.secondaryBorder,
      ...spacings.phXl,
      borderBottomLeftRadius: BORDER_RADIUS_PRIMARY,
      borderBottomRightRadius: BORDER_RADIUS_PRIMARY
    },
    headerContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      width: CARD_WIDTH,
      minHeight: 215,
      borderTopLeftRadius: BORDER_RADIUS_PRIMARY,
      borderTopRightRadius: BORDER_RADIUS_PRIMARY,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.secondaryBorder,
      overflow: 'hidden',
      ...spacings.mt4Xl
    },
    backgroundSVG: {
      position: 'absolute',
      zIndex: -1
    },
    link: {
      color: colors.violet,
      textDecorationLine: 'underline'
    }
  })

export default getStyles
