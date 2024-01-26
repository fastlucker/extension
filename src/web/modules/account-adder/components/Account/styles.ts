import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  networkIcon: ViewStyle
  bottomBorder: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...spacings.pvTy,
      width: '100%',
      ...flexbox.flex1,
      maxHeight: 78,
      height: 78
    },
    bottomBorder: {
      borderBottomWidth: 1,
      borderColor: theme.secondaryBorder
    },
    networkIcon: {
      borderRadius: 50,
      backgroundColor: theme.primaryBackground,
      borderColor: theme.secondaryBorder,
      borderWidth: 1
    }
  })

export default getStyles
