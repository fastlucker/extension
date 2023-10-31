import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_LG } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { POPUP_WIDTH } from '@web/constants/spacings'
import commonWebStyles from '@web/styles/utils/common'
import { getUiType } from '@web/utils/uiType'

interface Style {
  tabheader: ViewStyle
  container: ViewStyle
  contentContainer: ViewStyle
  tabheaderTitle: TextStyle
  tabheaderContent: ViewStyle
  headerLeft: ViewStyle
  noCollectibles: TextStyle
}

const isTab = getUiType().isTab

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    tabheader: {
      backgroundColor: theme.secondaryBackground,
      ...flexbox.directionRow,
      ...spacings.pvMd,
      ...spacings.phLg,
      position: 'relative'
    },
    headerLeft: {
      left: SPACING_LG,
      position: 'absolute',
      zIndex: 5
    },
    tabheaderContent: {
      ...flexbox.directionRow,
      ...flexbox.flex1,
      ...flexbox.justifyCenter,
      ...flexbox.alignCenter
    },
    tabheaderTitle: {
      ...spacings.mlSm
    },
    container: {
      backgroundColor: theme.primaryBackground,
      ...flexbox.flex1,
      maxWidth: isTab ? '100%' : POPUP_WIDTH
    },
    contentContainer: {
      ...flexbox.flex1,
      ...flexbox.directionRow,
      ...flexbox.wrap,
      justifyContent: isTab ? 'flex-start' : 'space-between',
      // Fixes huge gaps between rows
      alignContent: 'flex-start',
      ...commonWebStyles.contentContainer
    },
    noCollectibles: {
      textAlign: 'center',
      ...flexbox.flex1,
      ...spacings.mtXl
    }
  })

export default getStyles
