import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  container: ViewStyle
  checkbox: ViewStyle
  label: TextStyle
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    ...spacings.mb,
    ...spacings.phTy
  },
  checkbox: {
    borderWidth: 3,
    width: 25,
    height: 25,
    ...spacings.mrTy
  },
  label: {
    fontSize: 16
  }
})

export default styles
