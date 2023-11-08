import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  infoSideItem: ViewStyle
  errorSideItem: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    infoSideItem: {
      borderColor: theme.infoDecorative,
      borderWidth: 1,
      backgroundColor: theme.infoBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phXl,
      ...spacings.pvXl,
      ...spacings.mbLg
    },
    errorSideItem: {
      borderColor: theme.errorDecorative,
      borderWidth: 1,
      backgroundColor: theme.errorBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phXl,
      ...spacings.pvXl,
      ...spacings.mbLg
    }
  })

export default getStyles
