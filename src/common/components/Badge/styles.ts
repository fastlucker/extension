import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  infoBadge: ViewStyle
  defaultBadge: ViewStyle
  successBadge: ViewStyle
  warningBadge: ViewStyle
  errorBadge: ViewStyle
}

const label: ViewStyle = {
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
    infoBadge: {
      ...label,
      borderColor: theme.infoDecorative,
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
    },
    errorBadge: {
      ...label,
      borderColor: theme.errorDecorative,
      backgroundColor: theme.errorBackground
    }
  })

export default getStyles
