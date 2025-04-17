import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

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
      minHeight: 486,
      backgroundColor: theme.primaryBackground,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      ...spacings.pt0,
      ...spacings.phLg,
      ...spacings.pbLg,
      ...common.borderRadiusPrimary,
      overflow: 'hidden',
      ...common.shadowTertiary
    },
    headerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: CARD_WIDTH - 2,
      height: 170,
      alignSelf: 'center',
      backgroundColor: 'red',
      overflow: 'hidden'
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
