import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'

interface Style {
  itemContainer: ViewStyle
}

const styles = StyleSheet.create<Style>({
  itemContainer: {
    ...spacings.ph,
    ...spacings.pv,
    ...common.borderRadiusPrimary,
    height: 368,
    textAlign: 'center',
    alignItems: 'stretch'
  }
})

export default styles
