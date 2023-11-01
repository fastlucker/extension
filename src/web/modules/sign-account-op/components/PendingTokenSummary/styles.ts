import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      borderWidth: 1,
      height: 36,
      borderColor: theme.secondaryBorder,
      ...common.borderRadiusPrimary,
      ...flexbox.alignCenter,
      ...flexbox.directionRow,
      ...spacings.phTy,
      ...spacings.mbTy
    }
  })

export default getStyles
