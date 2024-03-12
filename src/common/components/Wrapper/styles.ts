import { StyleSheet, ViewStyle } from 'react-native'

import { SPACING_MI } from '@common/styles/spacings'

interface Style {
  wrapper: ViewStyle
  contentContainerStyle: ViewStyle
}

const styles = () =>
  StyleSheet.create<Style>({
    wrapper: {
      flex: 1,
      backgroundColor: 'transparent'
    },
    contentContainerStyle: {
      flexGrow: 1,
      paddingRight: SPACING_MI / 2
    }
  })

export default styles
