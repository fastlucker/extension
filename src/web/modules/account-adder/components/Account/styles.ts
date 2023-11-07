import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  networkIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...spacings.ph,
      ...spacings.pvTy,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      backgroundColor: colors.melrose_15,
      borderColor: theme.secondaryBorder,
      width: '100%',
      flex: 1,
      maxHeight: 78,
      height: 78
    },
    networkIcon: {
      borderRadius: 50,
      backgroundColor: colors.white,
      borderColor: colors.quartz,
      borderWidth: 2
    }
  })

export default getStyles
