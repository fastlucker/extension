import { StyleSheet, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  wrapper: ViewStyle
  contentContainerStyle: ViewStyle
}

const styles = (theme) =>
  StyleSheet.create<Style>({
    wrapper: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      ...spacings.phTy
    },
    contentContainerStyle: {
      ...spacings.pvSm,
      flexGrow: 1
    }
  })

export default styles
