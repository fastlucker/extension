import { StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  row: ViewStyle
  rowItem: ViewStyle
}

const styles = StyleSheet.create<Style>({
  row: {
    flexDirection: 'row'
  },
  rowItem: {
    paddingHorizontal: 15,
    paddingVertical: 10
  }
})

export default styles
