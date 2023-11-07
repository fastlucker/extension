import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

interface Style {
  container: ViewStyle
  modal: ViewStyle
  closeIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...flexbox.flex1,
      ...flexbox.justifyCenter,
      ...flexbox.alignCenter,
      backgroundColor: theme.backdrop
    },
    modal: {
      ...spacings.mh3Xl,
      ...spacings.mv3Xl,
      ...common.borderRadiusPrimary,
      ...spacings.phLg,
      ...spacings.pvLg,
      ...flexbox.alignCenter,
      ...common.shadowSecondary,
      backgroundColor: theme.primaryBackground,
      minWidth: 798
    },
    closeIcon: {
      position: 'absolute',
      right: SPACING,
      top: SPACING
    }
  })

export default getStyles
