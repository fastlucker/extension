import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native'

interface Style {
  row: ViewStyle
  rowItem: ViewStyle
  img: ImageStyle
}

const styles = StyleSheet.create<Style>({
  row: {
    flexDirection: 'row'
  },
  rowItem: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  img: {
    width: 35,
    height: 35
  }
})

export default styles
