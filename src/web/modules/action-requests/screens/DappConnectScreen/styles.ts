import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_SM } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common, { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Styles {
  container: ViewStyle
  content: ViewStyle
  contentHeader: ViewStyle
  contentBody: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      ...flexbox.alignCenter,
      ...spacings.pvLg,
      width: 454,
      marginHorizontal: 'auto'
    },
    content: {
      ...common.fullWidth,
      borderRadius: BORDER_RADIUS_PRIMARY,
      overflow: 'hidden',
      shadowColor: '#6770B3',
      shadowOffset: { width: 0, height: SPACING_SM },
      shadowOpacity: 0.3,
      shadowRadius: SPACING_SM,
      elevation: SPACING_SM
    },
    contentHeader: {
      ...spacings.pvXl,
      ...spacings.phXl,
      ...flexbox.alignCenter,
      backgroundColor: theme.tertiaryBackground
    },
    contentBody: {
      ...spacings.phXl,
      ...spacings.pvXl,
      ...spacings.pbLg,
      backgroundColor: theme.primaryBackground
    }
  })

export default getStyles
