import { StyleSheet, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  listItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  listItem: {
    backgroundColor: colors.listEvenColor,
    ...spacings.phTy,
    ...spacings.pvTy,
    flex: 1
  }
})

export default styles
