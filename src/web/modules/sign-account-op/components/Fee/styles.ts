import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  containerInner: ViewStyle
  disabled: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...spacings.phMi,
      ...spacings.pvMi
    },
    containerInner: {
      ...flexbox.alignCenter,
      ...spacings.phTy,
      ...spacings.pvTy,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      backgroundColor: theme.secondaryBackground,
      borderColor: theme.secondaryBorder
    },
    disabled: {
      opacity: 0.5
    }
  })

export default getStyles
