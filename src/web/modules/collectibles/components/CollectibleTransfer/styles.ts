import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_LG } from '@common/styles/spacings'
import viewStyle from '@web/modules/collectibles/screens/Collectible/styles'

interface Style {
  // Transfer
  container: ViewStyle
  title: TextStyle
  input: ViewStyle
  inputContainer: ViewStyle
  button: ViewStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...spacings.mlXl,
    ...viewStyle.section
  },
  title: {
    ...viewStyle.sectionTitle,
    ...spacings.mbXl
  },
  button: {
    width: 300
  },
  input: { ...spacings.phTy, width: '100%' },
  inputContainer: {
    marginBottom: SPACING_LG * 2
  }
})

export default styles
