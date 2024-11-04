import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'

type Styles = {
  container: ViewStyle
  header: ViewStyle
  expandedHeaderStyle: ViewStyle
  providerData: ViewStyle
  positionData: ViewStyle
  expandedPosition: ViewStyle
}

const getStyles = (theme: ThemeProps) =>
  StyleSheet.create<Styles>({
    container: {
      ...common.borderRadiusPrimary,
      overflow: 'hidden',
      ...spacings.mbMi
    },
    header: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter,
      ...flexbox.justifySpaceBetween,
      ...spacings.pvSm,
      ...spacings.phSm,
      ...common.borderRadiusPrimary,
      borderWidth: 1,
      borderColor: 'transparent'
    },
    expandedHeaderStyle: {
      borderColor: theme.primary
    },
    providerData: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    positionData: {
      ...flexbox.directionRow,
      ...flexbox.alignCenter
    },
    expandedPosition: {
      ...spacings.pv
    }
  })

export default getStyles
