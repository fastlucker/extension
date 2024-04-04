import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  footerContainer: ViewStyle
  container: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    footerContainer: {
      ...spacings.phSm,
      ...spacings.pbSm,
      width: '100%'
    },
    container: {
      ...flexbox.flex1,
      backgroundColor: theme.secondaryBackground,
      ...spacings.phSm,
      ...spacings.pvSm,
      ...common.borderRadiusPrimary,
      shadowOffset: {
        width: 0,
        height: -3
      },
      shadowColor: '#CACDE699',
      shadowOpacity: 1,
      shadowRadius: 6
    }
  })

export default getStyles
