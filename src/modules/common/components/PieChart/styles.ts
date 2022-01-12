import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

import spacings from '@modules/common/styles/spacings'

interface Style {
  symbol: ViewStyle
  row: ViewStyle
  value: TextStyle
  label: TextStyle
}

const styles = StyleSheet.create<Style>({
  symbol: {
    width: 15,
    height: 15,
    alignSelf: 'center',
    ...spacings.mrTy
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  label: {
    fontSize: 20
  },
  value: {
    fontSize: 16,
    textAlign: 'right',
    lineHeight: 20,
    paddingVertical: 5
  }
})

export default styles
