import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings, { SPACING_LG, SPACING_MD } from '@common/styles/spacings'
import viewStyle from '@web/modules/collectibles/screens/Collectible/styles'

interface Style {
  // Transfer
  container: ViewStyle
  title: TextStyle
  input: ViewStyle
  inputContainer: ViewStyle
  button: ViewStyle
  inputLabel: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    ...viewStyle.section,
    maxWidth: 400,
    paddingTop: SPACING_MD * 4, // 100
    marginLeft: SPACING_LG * 3 // 90
  },
  title: {
    ...viewStyle.sectionTitle,
    ...spacings.mbXl
  },
  button: {
    width: 300
  },
  inputLabel: {
    ...spacings.mb
  },
  input: { ...spacings.phTy, width: '100%' },
  inputContainer: {
    marginBottom: SPACING_LG * 2
  }
})

export default styles
