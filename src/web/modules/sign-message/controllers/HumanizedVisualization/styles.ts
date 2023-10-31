import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_LG, SPACING_MI, SPACING_TY } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import { getUiType } from '@web/utils/uiType'

interface Style {
  headerContent: ViewStyle
  body: ViewStyle
  bodyText: TextStyle
  explorerIcon: ViewStyle
}

const { isTab } = getUiType()

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    headerContent: {
      ...flexbox.flex1,
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.wrap
    },
    body: {
      ...spacings.pSm
    },
    bodyText: {
      marginBottom: isTab ? SPACING_LG : SPACING_TY,
      color: theme.primaryText
    },
    explorerIcon: {
      marginLeft: -SPACING_MI
    }
  })

export default getStyles
