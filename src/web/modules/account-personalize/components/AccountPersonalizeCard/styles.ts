import { ImageStyle, StyleSheet, ViewStyle } from 'react-native'

import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'

interface Style {
  container: ViewStyle
  pfp: ImageStyle
  pfpSelectorItem: ImageStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: colors.melrose_15,
    borderColor: colors.scampi_20,
    borderWidth: 1,
    ...common.borderRadiusPrimary,
    ...spacings.ph,
    ...spacings.pv,
    ...spacings.mb
  },
  pfp: {
    height: 64,
    width: 64,
    ...common.borderRadiusPrimary,
    ...spacings.mr
  },
  pfpSelectorItem: {
    height: 48,
    width: 48,
    ...common.borderRadiusPrimary
  }
})

export default styles
