import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  primaryBadge: ViewStyle
  defaultBadge: ViewStyle
  successBadge: ViewStyle
  warningBadge: ViewStyle
}

const label: ViewStyle = {
  height: 24,
  ...flexbox.alignCenter,
  ...flexbox.justifyCenter,
  ...spacings.phTy,
  borderWidth: 1,
  borderRadius: 50
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.directionRow,
      ...common.borderRadiusSecondary
    },
    primaryBadge: {
      ...label,
      borderColor: theme.primary,
      backgroundColor: theme.infoBackground
    },
    defaultBadge: {
      ...label,
      borderColor: theme.secondaryBorder,
      backgroundColor: 'transparent'
    },
    warningBadge: {
      ...label,
      borderColor: theme.warningDecorative,
      backgroundColor: theme.warningBackground
    },
    successBadge: {
      ...label,
      borderColor: theme.successDecorative,
      backgroundColor: theme.successBackground
    }
  })

export default getStyles
