import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  sideItem: ViewStyle
  infoSideItem: ViewStyle
  errorSideItem: ViewStyle
  warningSideItem: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    sideItem: {
      borderWidth: 1,
      ...common.borderRadiusPrimary,
      ...(IS_SCREEN_SIZE_DESKTOP_LARGE ? spacings.phLg : spacings.phMd),
      ...spacings.pvSm,
      ...spacings.mbLg
    },
    infoSideItem: {
      borderColor: theme.infoDecorative,
      backgroundColor: theme.infoBackground
    },
    errorSideItem: {
      borderColor: theme.errorDecorative,
      backgroundColor: theme.errorBackground
    },
    warningSideItem: {
      borderColor: theme.warningDecorative,
      backgroundColor: theme.warningBackground
    }
  })

export default getStyles
