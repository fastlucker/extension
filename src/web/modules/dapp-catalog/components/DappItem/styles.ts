import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  dappItemWrapper: ViewStyle
  container: ViewStyle
  icon: ImageStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    dappItemWrapper: {
      width: '33.33%',
      height: 146,
      ...spacings.phMi,
      ...spacings.pvMi
    },
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.secondaryBackground,
      ...common.borderRadiusPrimary,
      ...spacings.phTy,
      ...spacings.pvTy
    },
    icon: {
      width: 40,
      height: 40,
      ...common.borderRadiusPrimary,
      ...spacings.mrTy
    }
  })

export default getStyles
