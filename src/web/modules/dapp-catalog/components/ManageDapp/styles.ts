import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  networkSelectorContainer: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    networkSelectorContainer: {
      ...spacings.phSm,
      ...spacings.pvSm,
      backgroundColor: theme.infoBackground,
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      borderColor: theme.primary,
      ...flexbox.directionRow,
      ...spacings.mbLg
    }
  })

export default getStyles
