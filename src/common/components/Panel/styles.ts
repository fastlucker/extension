import { StyleSheet, ViewStyle } from 'react-native'

import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  onboardingContainer: ViewStyle
  innerContainer: ViewStyle
  progress: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    container: {
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      backgroundColor: theme.primaryBackground
    },
    // Overridden when type === 'onboarding'
    onboardingContainer: {
      ...common.borderRadiusSecondary,
      backgroundColor: theme.primaryBackground,
      ...common.shadowTertiary,
      alignSelf: 'center',
      overflow: 'hidden',
      // TODO: fix it
      minHeight: 468
    },
    innerContainer: {
      alignSelf: 'center',
      overflow: 'hidden',
      // TODO: fix it
      minHeight: 486
    },
    progress: {
      flex: 1,
      height: 4
    }
  })

export default getStyles
