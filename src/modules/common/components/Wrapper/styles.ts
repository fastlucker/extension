import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'

interface Style {
  wrapper: ViewStyle
  contentContainerStyle: ViewStyle
}

const styles = StyleSheet.create<Style>({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    ...spacings.phTy
  },
  contentContainerStyle: {
    ...spacings.pvSm,
    flexGrow: 1
  }
})

export default styles
