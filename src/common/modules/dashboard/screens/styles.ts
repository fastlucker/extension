import { StyleSheet, ViewStyle } from 'react-native'

import spacings, { SPACING_MI } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import commonWebStyles from '@web/styles/utils/common'

interface Style {
  container: ViewStyle
  contentContainer: ViewStyle
  overview: ViewStyle
  networks: ViewStyle
  networkIconContainer: ViewStyle
  networkIcon: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Style>({
    contentContainer: commonWebStyles.contentContainer,
    container: {
      ...flexbox.flex1,
      backgroundColor: theme.primaryBackground
    },
    overview: {
      backgroundColor: theme.secondaryBackground,
      ...flexbox.directionRow,
      ...flexbox.justifySpaceBetween,
      ...spacings.mb,
      ...spacings.phSm,
      ...spacings.pvLg,
      ...common.borderRadiusPrimary
    },
    networks: { ...flexbox.directionRow, ...flexbox.alignCenter },
    networkIconContainer: {
      borderRadius: 13,
      borderWidth: 1,
      borderColor: theme.secondaryBorder,
      backgroundColor: theme.secondaryBackground,
      marginLeft: -SPACING_MI
    },
    networkIcon: {
      width: 18,
      height: 18
    }
  })

export default getStyles
